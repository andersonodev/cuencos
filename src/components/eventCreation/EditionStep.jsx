
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EditionStep = ({ onSave, initialData, onBack }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || '',
        date: initialData.date || '',
        startTime: initialData.startTime || '',
        endTime: initialData.endTime || '',
        location: initialData.location || '',
        description: initialData.description || '',
      });
    }
  }, [initialData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSelectChange = (value, name) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'O título do evento é obrigatório';
    }
    
    if (!formData.category) {
      newErrors.category = 'Selecione uma categoria';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'O local do evento é obrigatório';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'A descrição do evento é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };
  
  const categories = [
    "Atlética", 
    "Festa", 
    "Congresso", 
    "Workshop", 
    "Feira", 
    "Palestra",
    "Cultural",
    "Esportivo"
  ];
  
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl text-white mb-8">Detalhes do Evento</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="title" className="text-white text-sm">
              Título do Evento <span className="text-red-500">*</span>
            </label>
            {errors.title && (
              <span className="text-red-500 text-xs">{errors.title}</span>
            )}
          </div>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Nome inteiro do Evento"
            className={`bg-gray-900 border-gray-700 text-white ${
              errors.title ? 'border-red-500' : ''
            }`}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="category" className="text-white text-sm">
              Categoria <span className="text-red-500">*</span>
            </label>
            {errors.category && (
              <span className="text-red-500 text-xs">{errors.category}</span>
            )}
          </div>
          <Select
            value={formData.category}
            onValueChange={(value) => handleSelectChange(value, 'category')}
          >
            <SelectTrigger 
              className={`w-full bg-gray-900 border-gray-700 text-white ${
                errors.category ? 'border-red-500' : ''
              }`}
            >
              <SelectValue placeholder="Escolha uma categoria" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectGroup>
                {categories.map((category) => (
                  <SelectItem 
                    key={category} 
                    value={category}
                    className="hover:bg-gray-700 cursor-pointer"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <h3 className="text-white text-lg mt-8">Data e Horário</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <label htmlFor="date" className="text-white text-sm">
                Data de começo <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="relative">
              <Input
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                placeholder="09/05/2025"
                className="bg-gray-900 border-gray-700 text-white pl-10"
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cuencos-purple" size={16} />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <label htmlFor="startTime" className="text-white text-sm">
                Horário de Começo <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="relative">
              <Input
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                placeholder="21:00"
                className="bg-gray-900 border-gray-700 text-white pl-10"
              />
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cuencos-purple" size={16} />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <label htmlFor="endTime" className="text-white text-sm">
                Horário de fim <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="relative">
              <Input
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                placeholder="04:00"
                className="bg-gray-900 border-gray-700 text-white pl-10"
              />
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cuencos-purple" size={16} />
            </div>
          </div>
        </div>
        
        <h3 className="text-white text-lg mt-4">Local</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="location" className="text-white text-sm">
              Onde o evento vai acontecer? <span className="text-red-500">*</span>
            </label>
            {errors.location && (
              <span className="text-red-500 text-xs">{errors.location}</span>
            )}
          </div>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Em breve... - Curitiba / Paraná"
            className={`bg-gray-900 border-gray-700 text-white ${
              errors.location ? 'border-red-500' : ''
            }`}
          />
        </div>
        
        <h3 className="text-white text-lg mt-4">Descrição</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="description" className="text-white text-sm">
              Descrição do Evento <span className="text-red-500">*</span>
            </label>
            {errors.description && (
              <span className="text-red-500 text-xs">{errors.description}</span>
            )}
          </div>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Escreva detalhes e informações sobre o evento"
            className={`bg-gray-900 border-gray-700 text-white min-h-[200px] ${
              errors.description ? 'border-red-500' : ''
            }`}
          />
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

export default EditionStep;
