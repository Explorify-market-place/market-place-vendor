// components/layouts/Footer.tsx
import Link from "next/link";

function VisaIcon() {
  return (
    <svg viewBox="0 0 64 40" width="40" height="24" aria-hidden>
      <rect width="64" height="40" rx="4" fill="#142688" />
      <text x="10" y="26" fontFamily="Arial" fontWeight="700" fontSize="14" fill="#fff">VISA</text>
    </svg>
  );
}

function MastercardIcon() {
  return (
    <svg viewBox="0 0 64 40" width="40" height="24" aria-hidden>
      <rect width="64" height="40" rx="4" fill="#fff" />
      <g transform="translate(10,5)">
        <circle cx="12" cy="15" r="10" fill="#ff5f00" />
        <circle cx="28" cy="15" r="10" fill="#eb001b" opacity="0.95"/>
        <path d="M20 5 a10 10 0 0 1 0 20 a10 10 0 0 1 0-20" fill="#ff5f00" opacity="0.6"/>
      </g>
    </svg>
  );
}

function AmexIcon() {
  return (
    <svg viewBox="0 0 64 40" width="40" height="24" aria-hidden>
      <rect width="64" height="40" rx="4" fill="#2e77bb" />
      <text x="8" y="26" fontFamily="Arial" fontWeight="800" fontSize="10" fill="#fff">AMERICAN</text>
      <text x="8" y="34" fontFamily="Arial" fontWeight="800" fontSize="10" fill="#fff">EXPRESS</text>
    </svg>
  );
}

function PayPalIcon() {
  return (
    <svg viewBox="0 0 64 40" width="40" height="24" aria-hidden>
      <rect width="64" height="40" rx="4" fill="#003087" />
      <g transform="translate(8,8)">
        <path d="M0 0h10l2 8h-10z" fill="#009cde" />
        <path d="M12 0h10l-2 8H12z" fill="#012a72" />
      </g>
    </svg>
  );
}

function ApplePayIcon() {
  return (
    <svg viewBox="0 0 64 40" width="40" height="24" aria-hidden>
      <rect width="64" height="40" rx="4" fill="#111827" />
      <text x="8" y="26" fontFamily="Arial" fontWeight="700" fontSize="12" fill="#fff"> Pay</text>
    </svg>
  );
}

function GooglePayIcon() {
  return (
    <svg viewBox="0 0 64 40" width="40" height="24" aria-hidden>
      <rect width="64" height="40" rx="4" fill="#fff" stroke="#e5e7eb" />
      <g transform="translate(8,6)">
        <path d="M0 0h8v8H0z" fill="#4285F4"/>
        <path d="M9 0h8v8H9z" fill="#EA4335"/>
      </g>
      <text x="30" y="26" fontFamily="Arial" fontWeight="600" fontSize="11" fill="#202124">G Pay</text>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="text-2xl font-bold text-white">Explorify</div>
          <p className="text-sm text-slate-300 mt-2 max-w-sm">
            List your packages and reach millions of travelers. Manage bookings, reviews and grow your business.
          </p>

          <div className="mt-6">
            <div className="text-sm text-slate-300 mb-2 font-semibold">Language</div>
            <select className="w-full rounded-lg p-3 bg-white text-slate-800 shadow-sm">
              <option>English (United States)</option>
              <option>English (India)</option>
              <option>हिन्दी</option>
            </select>
          </div>

          <div className="mt-4">
            <div className="text-sm text-slate-300 mb-2 font-semibold">Currency</div>
            <select className="w-full rounded-lg p-3 bg-white text-slate-800 shadow-sm">
              <option>Indian Rupee (₹)</option>
              <option>USD ($)</option>
              <option>EUR (€)</option>
            </select>
          </div>
        </div>

        <div>
          <div className="font-semibold text-white mb-4">Mobile</div>
          <div className="flex flex-col gap-3">
            <a href="#" className="inline-block w-40">
              <div className="bg-black text-white rounded-md px-3 py-2 flex items-center gap-3">
                <svg className="w-6 h-6" viewBox="0 0 512 512" fill="white" aria-hidden><path d="M325 256L105 64v384l220-192z"></path></svg>
                <div className="text-xs text-left">
                  <div className="font-semibold">Get it on</div>
                  <div>Google Play</div>
                </div>
              </div>
            </a>
            <a href="#" className="inline-block w-40">
              <div className="bg-black text-white rounded-md px-3 py-2 flex items-center gap-3">
                <svg className="w-6 h-6" viewBox="0 0 512 512" fill="white" aria-hidden><path d="M349 63c-23 1-52 17-69 36-15 16-27 40-22 64 24 1 51-11 67-27 16-16 29-40 24-73z"></path></svg>
                <div className="text-xs text-left">
                  <div className="font-semibold">Download on the</div>
                  <div>App Store</div>
                </div>
              </div>
            </a>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="font-semibold mb-3">Support</div>
              <ul className="text-sm space-y-2">
                <li><Link href="/contact" className="hover:underline">Contact</Link></li>
                <li><Link href="/legal" className="hover:underline">Legal Notice</Link></li>
                <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
                <li><Link href="/cookie" className="hover:underline">Cookies & Preferences</Link></li>
                <li><Link href="/terms" className="hover:underline">Terms & Conditions</Link></li>
              </ul>
            </div>

            <div>
              <div className="font-semibold mb-3">Company</div>
              <ul className="text-sm space-y-2">
                <li><Link href="/about" className="hover:underline">About Us</Link></li>
                <li><Link href="/careers" className="hover:underline">Careers</Link></li>
                <li><Link href="/blog" className="hover:underline">Blog</Link></li>
                <li><Link href="/press" className="hover:underline">Press</Link></li>
                <li><Link href="/explorer" className="hover:underline">Explorer</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <div className="font-semibold mb-3">Ways you can pay</div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-12 h-8 bg-white/5 rounded-md flex items-center justify-center p-1"><VisaIcon /></div>
            <div className="w-12 h-8 bg-white/5 rounded-md flex items-center justify-center p-1"><MastercardIcon /></div>
            <div className="w-12 h-8 bg-white/5 rounded-md flex items-center justify-center p-1"><AmexIcon /></div>
            <div className="w-12 h-8 bg-white/5 rounded-md flex items-center justify-center p-1"><PayPalIcon /></div>
            <div className="w-12 h-8 bg-white/5 rounded-md flex items-center justify-center p-1"><GooglePayIcon /></div>
            <div className="w-12 h-8 bg-white/5 rounded-md flex items-center justify-center p-1"><ApplePayIcon /></div>
          </div>

          <div className="mt-6">
            <div className="font-semibold mb-2">Contact</div>
            <div className="text-sm">support@explorify.example</div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
              <span className="text-white text-sm font-semibold">f</span>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
              <span className="text-white text-sm font-semibold">ig</span>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
              <span className="text-white text-sm font-semibold">X</span>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
              <span className="text-white text-sm font-semibold">in</span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-slate-400 flex items-center justify-between">
          <div>© {new Date().getFullYear()} Explorify — Built for vendors</div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
