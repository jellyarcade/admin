import React, { useState, useEffect } from 'react';

function GameForm({ initialData, categories, onSubmit }) {
  const [title, setTitle] = useState({ tr: '', en: '' });
  const [description, setDescription] = useState({ tr: '', en: '' });
  const [isShowcased, setIsShowcased] = useState(false);
  const [showcasedCategories, setShowcasedCategories] = useState([]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || { tr: '', en: '' });
      setDescription(initialData.description || { tr: '', en: '' });
      setIsShowcased(initialData.isShowcased || false);
      setShowcasedCategories(initialData.showcasedCategories || []);
    }
  }, [initialData]);

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('title.tr', title.tr);
    formData.append('title.en', title.en);
    formData.append('description.tr', description.tr);
    formData.append('description.en', description.en);
    formData.append('isShowcased', isShowcased);
    formData.append('showcasedCategories', JSON.stringify(showcasedCategories));

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <input
          type='text'
          value={title.tr}
          onChange={e => setTitle({ ...title, tr: e.target.value })}
          placeholder='Türkçe Başlık'
        />
      </div>

      <div className='form-group'>
        <label>
          <input
            type='checkbox'
            checked={isShowcased}
            onChange={e => setIsShowcased(e.target.checked)}
          />
          Manşette Göster
        </label>
      </div>

      <div className='form-group'>
        <label>Manşet Kategorileri</label>
        <select
          multiple
          value={showcasedCategories}
          onChange={e =>
            setShowcasedCategories(
              Array.from(e.target.selectedOptions, option => option.value)
            )
          }
        >
          {categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <button type='submit'>Kaydet</button>
    </form>
  );
}

export default GameForm;
