import React, { useEffect, useState } from 'react';
import { fetchServices } from '../api';
import { Service } from '../types';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices()
      .then(res => setServices(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-4">Services I Offer</h1>
      <p className="text-xl text-gray-600 text-center mb-12">
        Custom solutions tailored to your needs
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map(service => (
          <div key={service.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            {service.icon && (
              <div className="text-4xl text-blue-600 mb-4">
                <i className={service.icon}></i> {/* If using FontAwesome, otherwise just text */}
              </div>
            )}
            <h3 className="text-xl font-bold mb-2">{service.title}</h3>
            <p className="text-gray-600 mb-4">{service.description}</p>
            {service.price_range && (
              <p className="text-blue-600 font-semibold">💰 {service.price_range}</p>
            )}
            <Link
              to="/contact"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Inquire
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;