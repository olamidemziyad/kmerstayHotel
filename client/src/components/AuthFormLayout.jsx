import Message from "./Message";
import React from 'react';
import { Building2 } from 'lucide-react';
import LogSigNavbar from "./navbars/Login-Signin";

export function AuthFormLayout({ children, title, subtitle, error, success }) {
  return (
    <div className="min-h-screen flex">
      {/* Navbar en haut de la colonne gauche */}
      <div className="flex-1 flex flex-col">
        <LogSigNavbar />
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <div className="flex justify-center">
                <Building2 className="h-12 w-12 text-blue-600" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">{title}</h2>
              <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
            </div>
            {error && <Message type="error">{error}</Message>}
            {success && <Message type="success">{success}</Message>}
            {children}
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2">
        <div className="h-full w-full relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-600/90 mix-blend-multiply" />
          <img
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d"
            alt="Hotel interior"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <h3 className="text-4xl font-bold mb-4">Bienvenue sur KmerStay </h3>
              <p className="text-xl">Découvrez les meilleures expériences d’hébergement au Cameroun grâce à KmerStay.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
