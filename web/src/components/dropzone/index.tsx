import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface DropzoneProps {
    onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileUploaded }) => {

    const [getSelectedFileUrl, setSelectedFileUrl] = useState('');
    
    const onDrop = useCallback(acceptedFiles => {

        const fileUrl = URL.createObjectURL(acceptedFiles[0]);

        setSelectedFileUrl(fileUrl);

        onFileUploaded(acceptedFiles[0])
        
    }, []);
    
    const { getRootProps, getInputProps, isDragActive } = useDropzone(
        { 
            onDrop,
            accept: 'image/*'
        }
    );
    
    return (
        <div {...getRootProps()} className='dropzone'>
            <input {...getInputProps()} accept='image/*' />

            {(getSelectedFileUrl)
                ? <img src={getSelectedFileUrl} alt="point-thumbnail-upload"/>
                : ((isDragActive) 
                        ? <p><FiUpload />Solte a imagem aqui...</p> 
                        : <p><FiUpload />Arraste e solte a imagem do estabelecimento, ou clique aqui para selecionar a imagem.</p>    
                )
            }

        </div>
    )
}

export default Dropzone;