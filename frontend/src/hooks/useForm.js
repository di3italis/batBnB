import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as spotActions from '../store/spots';

export default function useForm(type, spot) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [update, setUpdate] = useState(false);
    const [formData, setFormData] = useState({
        country: '',
        address: '',
        city: '',
        state: '',
        lat: '',
        lng: '',
        name: '',
        description: '',
        price: '',
        previewImg: '',
        img2: '',
        img3: '',
        img4: '',
        img5: '',
    });
    const [errors, setErrors] = useState({});
    
    if (type) { // send true from update, false from create
        setUpdate(true);
    }

    const imgUrls = {};

    if (spots.SpotImages && spots.SpotImages.length) {
        let i = 2;
        spots.SpotImages.forEach((img) => {
            img.preview ? imgUrls.previewImg = img.url : imgUrls[`img${i++}`] = img.url; // i++ increments i after the value is assigned. ex: img2, img3, img4, img5
        })
    }

    const inputs = [
        {
            name: 'country',
            label: 'Country',
            placeholder: update ? spot.country : `${label}`,
            type: 'text',
        },
        {
            name: 'address',
            label: 'Address',
            placeholder: update ? spot.address : `${label}`,
            type: 'text',
        },
        { 
            name: 'city', 
            label: 'City',
            placeholder: update ? spot.city : `${label}`,
            type: 'text', 
        },
        { 
            name: 'state', 
            label: 'State',
            placeholder: update ? spot.state : `${label}`,
            type: 'text', 
        },
        { 
            name: 'lat', 
            label: 'Latitude',
            placeholder: update ? spot.lat : `${label}`,
            type: 'text', 
        },
        { 
            name: 'lng', 
            label: 'Longitude',
            placeholder: update ? spot.lng : `${label}`,
            type: 'text', 
        },
        { 
            name: 'description', 
            placeholder: update ? spot.description : 'Description',
            type: 'textarea' 
        },
        {
            name: 'name',
            label: 'Name of your spot',
            placeholder: update ? spot.name : `${label}`,
            type: 'text',
        },
        { 
            name: 'price', 
            placeholder: update ? spot.price : 'Price per night (USD)', 
            type: 'number' 
        },
        { 
            name: 'previewImg', 
            placeholder: update ? imgUrls.previewImg : 'Preview Image URL', 
            type: 'text' 
        },
        { 
            name: 'img2', 
            placeholder: update ? imgUrls.img2 : 'Image URL', 
            type: 'text' 
        },
        { 
            name: 'img3', 
            placeholder: update ? imgUrls.img3 :'Image URL', 
            type: 'text' 
        },
        { 
            name: 'img4', 
            placeholder: update ? imgUrls.img4 : 'Image URL', 
            type: 'text' 
        },
        { 
            name: 'img5', 
            placeholder: update ? imgUrls.img5 :'Image URL',
            type: 'text' 
        },
    ];

    return {
        dispatch,
        navigate,
        formData,
        setFormData,
        errors,
        setErrors,
        inputs,
    };
}
