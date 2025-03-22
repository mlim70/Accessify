import { FC } from 'react'

interface Feature {
  title: string
  description: string
  icon: string
}

const Features: FC = () => {
  const features: Feature[] = [
    {
      title: 'Text Enhancement',
      description: 'Customize font sizes, contrast, and spacing for better readability',
      icon: '📝',
    },
    {
      title: 'Color Adaptation',
      description: 'Modify color schemes to accommodate various types of color vision deficiencies',
      icon: '🎨',
    },
    {
      title: 'Navigation Assistance',
      description: 'Simplified navigation controls and keyboard shortcuts',
      icon: '🔍',
    },
  ]

  return (
    <div className="mt-20">
      <h2 className="text-3xl font-bold text-center text-gray-900">
        Key Features
      </h2>
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="relative p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
            <p className="mt-2 text-gray-500">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Features 