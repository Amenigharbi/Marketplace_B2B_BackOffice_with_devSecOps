import Image from "next/image";
import { useState } from "react";
import EmailFormPopup from "./email";

interface SupplierDetails {
  company_name: string;
  contact_name: string;
  phone_number: string;
  email: string;
  postal_code: string;
  city: string;
  country: string;
}

interface FooterProps {
  supplier: SupplierDetails | null;
}

const Footer: React.FC<FooterProps> = ({ supplier }) => {
  const [showEmailForm, setShowEmailForm] = useState(false);

  return (
    <>
      {showEmailForm && supplier && (
        <EmailFormPopup
          onClose={() => setShowEmailForm(false)}
          supplierDetails={{
            company_name: supplier.company_name,
            contact_name: supplier.contact_name,
            phone_number: supplier.phone_number,
            email: supplier.email,
            address: `${supplier.postal_code} ${supplier.city}, ${supplier.country}`,
          }}
        />
      )}

      <footer className="mt-12 bg-[#384179] py-3 text-center text-white">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between">
          {/* Logo et copyright */}
          <div className="flex flex-col items-start">
            <Image
              alt="logo"
              width={100}
              height={38}
              src="/images/kamioun.png"
            />
            <p className="mt-3 text-sm">
              © 2025 Kamioun. Tous droits réservés.
            </p>
          </div>

          {/* Services divisés */}
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold">Nos Services</h3>
            <div className="flex space-x-8">
              {/* Services Marketing */}
              <div>
                <h4 className="mb-1 text-sm font-medium">Services Marketing</h4>
                <ul className="space-y-1 text-xs">
                  <li>Annonces</li>
                  <li>Promotions</li>
                  <li>Codes de réduction pour clients</li>
                </ul>
              </div>

              {/* Services Commerciaux */}
              <div>
                <h4 className="mb-1 text-sm font-medium">
                  Services Commerciaux
                </h4>
                <ul className="space-y-1 text-xs">
                  <li>Consultation commerciale personnalisée</li>
                  <li>Devis sur mesure</li>
                  <li>Suivi de commande & support</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bouton Demande de service */}
          <div>
            <button
              onClick={() => setShowEmailForm(true)}
              className="rounded-md bg-[rgb(251_201_22/_var(--tw-bg-opacity))] px-4 py-1 text-black transition-all hover:bg-yellow-500"
            >
              Demander un service
            </button>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
