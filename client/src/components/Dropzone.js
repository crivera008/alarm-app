import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import './Dropzone.css';
import { AiOutlineCloudUpload } from "react-icons/ai";

const Dropzone = ({ className }) => {
  const [file, setFile] = useState();
  const [uploadedFile, setUploadedFile] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length) {
      const acceptedFile = acceptedFiles[0];
      setFile(acceptedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
        'audio/wav': ['.WAV']
    },
    maxSize: 1024 * 1000,
    onDrop
  });

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return;

    console.log(file);

    // POST REQ HERE
    
    setUploadedFile(file);
    removeFile();
  };

  return (
    <div>
    <form onSubmit={handleSubmit}>
    <div
        {...getRootProps({
          className: className
        })}
      >
        <input {...getInputProps()} />
        {!file && (
        <div className='box'>
        <AiOutlineCloudUpload size={60}/>
          {isDragActive ? (
            <p>Drop WAV file here ...</p>
          ) : (
            <p>Drag WAV file here or <b>click</b> to select file</p>
          )}
        </div>)}
      </div>

      <section>
        {file && (
          <div>
            {file.name}
            <button
              type='button'
              className='delete'
              onClick={removeFile}
            >
                <strong>x</strong>
            </button>
          </div>
        )}
          <button type='submit'>Upload</button>
      </section>
    </form>
    <div className='currentSetting'>
          Song: <strong>{uploadedFile.name}</strong>
        </div>
        </div>
  );
};

export default Dropzone;

      