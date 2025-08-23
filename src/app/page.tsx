import GeocodeTest from '../components/geocode-test'

// TO-DO: DOCUMENTATION
export default function Home() {
  return (
    <main className="min-h-screen bg-dark p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Location Intelligence
        </h1>
        
        <GeocodeTest />
      </div>
    </main>
  )
}