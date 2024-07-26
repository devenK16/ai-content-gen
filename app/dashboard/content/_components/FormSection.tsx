"use client"
import React, { useState } from 'react'
import { TEMPLATE } from '../../_components/TemplateListSection'
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2Icon , ChevronDownIcon  } from 'lucide-react';

interface PROPS {
  selectedTemplate?: TEMPLATE;
  userFormInput: any,
  loading: boolean
}

const FormSection = ({ selectedTemplate, userFormInput, loading }: PROPS) => {

  // Initialize formData with default values
  const [formData, setFormData] = useState<any>({ tone: [], language: 'English' });
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleToneClick = (tone: string) => {
    setSelectedTones(prev => {
      const newSelectedTones = prev.includes(tone)
        ? prev.filter(t => t !== tone)
        : [...prev, tone];
      setFormData({ ...formData, tone: newSelectedTones });
      return newSelectedTones;
    });
  }

  const handleLanguageClick = () => {
    setShowDropdown(prev => !prev);
  }

  const handleLanguageSelect = (language: string) => {
    setFormData({ ...formData, language });
    setShowDropdown(false);
  }

  const onSubmit = (e: any) => {
    e.preventDefault();
    userFormInput(formData);
  }

  const tones = [
    'Unique', 'Creative', 'Humorous', 'Dramatic', 'Inspirational', 'Crisp', 'Motivational', 'Nostalgic', 'Bold'
  ];

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Portuguese', 'Italian', 'Russian'
  ];

  return (
    <div className='p-5 shadow-md border rounded-lg bg-white'>
      {/* @ts-ignore */}
      <Image src={selectedTemplate?.icon} alt='icon' width={70} height={70} />
      <h2 className='font-bold text-2xl mb-2 text-primary'>{selectedTemplate?.name}</h2>
      <p className='text-gray-500 text-sm'>{selectedTemplate?.desc}</p>
      <form className='mt-6' onSubmit={onSubmit}>
        {selectedTemplate?.form?.map((item, index) => (
          <div key={index} className='my-2 flex flex-col gap-2 mb-7'>
            <label className='font-bold'>
              {item.label}
            </label>
            {item.field === 'input' ?
              <Input name={item.name} required={item?.required} onChange={handleInputChange} /> : item.field === 'textarea' ?
                <Textarea name={item.name} required={item?.required} onChange={handleInputChange} /> : null
            }
          </div>
        ))}
        {/* Tone selection section */}
        <div className='mb-5'>
          <label className='font-bold block mb-2'>
            Select Tones
          </label>
          <div className='flex flex-wrap gap-2'>
            {tones.map((tone, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleToneClick(tone)}
                className={`px-4 py-2 cursor-pointer ${selectedTones.includes(tone) ? 'bg-primary text-white border rounded-full' : 'bg-white text-gray-800 border rounded-full'}`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>
        <div className='my-2 mb-7'>
          <label className='font-bold block mb-2'>
            Select Language
          </label>
          <div className='relative'>
            <button type="button" onClick={handleLanguageClick} className='w-full p-2 border rounded bg-white text-gray-800 flex items-center justify-between'>
              <span>{formData.language || 'English'}</span> 
              <ChevronDownIcon className='w-4 h-4 ml-2' /> 
            </button>
            {showDropdown && (
              <div className='absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto'>
                {languages.filter(language => language !== formData.language).map((language, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleLanguageSelect(language)}
                    className='block w-full text-left p-2 hover:bg-gray-200'
                  >
                    {language}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <Button type="submit" className='w-full py-6' disabled={loading}>
          {loading && <Loader2Icon className='animate-spin' />}
          Generate Content
        </Button>
      </form>
    </div>
  )
}

export default FormSection
