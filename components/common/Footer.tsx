import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200 mt-auto">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 via-purple-900/10 to-transparent pointer-events-none" />

      <div className="relative container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
              Explorify Vendor Portal
            </div>
            <p className="text-sm text-slate-300 mb-4 max-w-sm">
              Grow your travel business and reach thousands of travelers
              worldwide with our vendor platform.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-700/50 hover:bg-blue-600 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <span className="text-sm font-semibold">f</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-700/50 hover:bg-pink-600 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <span className="text-sm font-semibold">ig</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-700/50 hover:bg-slate-600 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <span className="text-sm font-semibold">𝕏</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="font-semibold text-white mb-4">Vendor Tools</div>
            <ul className="text-sm space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-slate-300 hover:text-blue-400 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/bookings"
                  className="text-slate-300 hover:text-blue-400 transition-colors"
                >
                  Bookings
                </Link>
              </li>
              <li>
                <Link
                  href="/analytics"
                  className="text-slate-300 hover:text-blue-400 transition-colors"
                >
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <div className="font-semibold text-white mb-4">Legal & Support</div>
            <ul className="text-sm space-y-2">
              <li>
                <Link
                  href="https://merchant.razorpay.com/policy/Rn6lxkXvDOSLbk/terms"
                  className="text-slate-300 hover:text-blue-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="https://merchant.razorpay.com/policy/Rn6lxkXvDOSLbk/privacy"
                  className="text-slate-300 hover:text-blue-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="https://merchant.razorpay.com/policy/Rn6lxkXvDOSLbk/refund"
                  className="text-slate-300 hover:text-blue-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cancellation & Refunds
                </Link>
              </li>
              <li>
                <Link
                  href="https://merchant.razorpay.com/policy/Rn6lxkXvDOSLbk/contact_us"
                  className="text-slate-300 hover:text-blue-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <div className="font-semibold text-white mb-4">Support</div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:info.explorifytrips@gmail.com"
                  className="text-slate-300 hover:text-blue-400 transition-colors break-all"
                >
                  info.explorifytrips@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">Indore, India</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="font-semibold text-white text-sm mb-2">
                Resources
              </div>
              <ul className="text-sm space-y-2">
                <li>
                  <Link
                    href="/help"
                    className="text-slate-300 hover:text-blue-400 transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/vendor-guide"
                    className="text-slate-300 hover:text-blue-400 transition-colors"
                  >
                    Vendor Guide
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700/50 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-400">
            © {new Date().getFullYear()}{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
              Explorify Trips
            </span>
            . All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Made with ❤️ in India</span>
            <span>•</span>
            <span>Powered by Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
