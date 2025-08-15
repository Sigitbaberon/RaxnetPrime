import React from "react";
import { Navigation } from "./Navigation";
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <span className="mr-2">📰</span>
                Raxnet Prime
              </h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Portal berita online premium dengan liputan terkini dan mendalam tentang politik, ekonomi, teknologi, olahraga, hiburan, dan berita dunia.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="link-facebook">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="link-twitter">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="link-instagram">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="link-youtube">
                  <Youtube className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="link-linkedin">
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Kategori</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Politik</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ekonomi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Teknologi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Olahraga</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hiburan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dunia</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Newsletter</a></li>
                <li><a href="/api/rss" className="hover:text-white transition-colors">RSS Feed</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Notifikasi Push</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Developer</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Raxnet Prime. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Kebijakan Privasi</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Syarat & Ketentuan</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Kontak</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Tentang Kami</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
