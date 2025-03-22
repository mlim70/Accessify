import React from 'react'

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-semibold ml-3">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

export default FeatureCard

