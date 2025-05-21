
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const CoverStep = ({ onSave, initialData, onBack }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    // If there's an existing image, show it as preview
    if (initialData && initialData.image && initialData.image !== '/lovable-uploads/placeholder.svg') {
      setPreview(initialData.image);
      
      // Simulate file info for the existing image
      const filename = initialData.image.split('/').pop();
      setFileInfo({
        name: filename || 'capa.jpg',
      });
    }
  }, [initialData]);
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Formato inválido",
        description: "Por favor, use apenas arquivos JPG ou PNG",
        variant: "destructive",
      });
      return;
    }
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    setSelectedFile(file);
    setFileInfo(file);
  };
  
  const validateImageDimensions = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const isValid = img.width >= 1170 && img.height >= 504;
        resolve(isValid);
      };
      img.onerror = () => {
        resolve(false);
      };
      img.src = src;
    });
  };
  
  const handleChooseFile = () => {
    fileInputRef.current.click();
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!preview) {
      toast({
        title: "Imagem necessária",
        description: "Por favor, selecione uma imagem de capa para continuar",
        variant: "destructive",
      });
      return;
    }
    
    // Validate image dimensions
    const isValidDimensions = await validateImageDimensions(preview);
    if (!isValidDimensions) {
      toast({
        title: "Imagem muito pequena",
        description: "A imagem deve ter pelo menos 1170x504 pixels",
        variant: "warning",
      });
      // Allow continuing anyway
    }
    
    onSave({ image: preview });
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl text-white mb-8">Upload de Imagem</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-900 border border-gray-700 rounded-md p-6">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png"
            className="hidden"
            ref={fileInputRef}
          />
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1">
              {fileInfo ? (
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={handleChooseFile}
                    className="bg-cuencos-purple text-white text-xs px-3 py-1 rounded-sm mr-2"
                  >
                    Escolher outro
                  </button>
                  <span className="text-gray-400 text-sm">{fileInfo.name}</span>
                  {preview && <span className="text-green-500 ml-2">✓</span>}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleChooseFile}
                  className="bg-cuencos-purple text-white text-xs px-3 py-1 rounded-sm"
                >
                  Escolher arquivo
                </button>
              )}
            </div>
          </div>
          
          {preview ? (
            <div className="relative w-full h-64 overflow-hidden rounded mb-4">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-700 rounded-md h-64 flex items-center justify-center mb-4">
              <div className="text-center">
                <p className="text-gray-500">Nenhum arquivo selecionado</p>
                <button
                  type="button"
                  onClick={handleChooseFile}
                  className="text-cuencos-purple hover:text-white mt-2"
                >
                  Selecione um arquivo
                </button>
              </div>
            </div>
          )}
          
          <p className="text-sm text-gray-500">
            Imagem deve ter pelo menos 1170 pixels de largura e 504 pixels de altura.
            <br />
            Formatos válidos: JPG e PNG.
          </p>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className="border-cuencos-purple text-cuencos-purple hover:bg-cuencos-purple hover:text-white transition-all"
          >
            Voltar
          </Button>
          
          <Button
            type="submit"
            className="bg-cuencos-purple text-white hover:bg-cuencos-darkPurple"
          >
            Salvar e Continuar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CoverStep;
