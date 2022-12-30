import React, { useState,useEffect } from "react";
import PDFMerger from 'pdf-merger-js/browser';

const MAX_COUNT = 50;

function UploadFile() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState();
  const [fileLimit, setFileLimit] = useState(false);
  
  const handleUploadFiles = (files) => {
    const uploaded = [...uploadedFiles];
    console.log(uploaded)
    let limitExceeded = false;
    files.some((file) => {
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);
        if (uploaded.length === MAX_COUNT) setFileLimit(true);
        if (uploaded.length > MAX_COUNT) {
          alert(`You can only add a maximum of ${MAX_COUNT} file`);
          setFileLimit(false);
          limitExceeded = true;
          return true;
        }
      }
    });
    if (!limitExceeded) setUploadedFiles(uploaded);
  };
  useEffect(() => {
    const render = async () => {
      const merger = new PDFMerger();

      for(const file of uploadedFiles) {
        await merger.add(file)
      }

      const mergedPdf = await merger.saveAsBlob();
      const url = URL.createObjectURL(mergedPdf);

      return setMergedPdfUrl(url);
    };
  
    render().catch((err)=>{
      throw err;
    })
  
    
  }, [uploadedFiles, setMergedPdfUrl]);
  
  console.log(uploadedFiles)
  const handleFileEvent = (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
  };
  
  return (
    <div>
      <h1>DOC TO PDF</h1>
      <input
        type="file"
        multiple
        onChange={handleFileEvent}
        disabled={fileLimit}
      />
      
      <div className="uploaded-files-list">
        {uploadedFiles.map((file) => (
          <div>{file.name}</div>
        ))}
      </div>
      <iframe
      height={1000}
      src={`${mergedPdfUrl}`}
      tittle='pdf-viewer'
      width='100%s'></iframe>
    </div>
  );
}

export default UploadFile;
