import Link from "next/link";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-full py-2 my-10">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Home Page</h1>
      <p className="mb-4">This is the main landing page of the application.</p>
      <Link href="/register" className="text-blue-500 hover:underline bg-blue-200 p-2 rounded-xl">Go to Register Page</Link>
      <Link href="/login" className="text-blue-500 hover:underline bg-blue-200 p-2 rounded-xl">Go to Login Page</Link>
      <Link href="/aceptacion-profesionales" className="text-blue-500 hover:underline bg-blue-200 p-2 rounded-xl">Go to Aceptar Profesionales</Link>
    </div>
  )
};

export default Page;