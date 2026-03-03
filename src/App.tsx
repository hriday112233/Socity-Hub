import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Wrench, 
  Droplets, 
  Milk, 
  Scale, 
  Stethoscope, 
  MessageSquareWarning, 
  MessageSquare,
  ShieldCheck, 
  User as UserIcon,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  CreditCard,
  Headphones,
  FileText,
  Search,
  Bell,
  Building2,
  Calendar,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Languages,
  TrendingUp,
  Briefcase,
  ShoppingBag,
  Scissors,
  Car,
  Utensils,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Service, Booking, Complaint, Notice, Amenity, AmenityBooking, Transaction, RegistrationReport } from './types';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'mr', name: 'मराठी' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'ur', name: 'اردو' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'മലയാളം' }
];

const TRANSLATIONS: Record<string, any> = {
  en: {
    dashboard: 'Dashboard', services: 'Services', complaints: 'Complaints', subscription: 'Subscription',
    notices: 'Notices', amenities: 'Amenities', admin: 'Admin', wallet: 'Wallet', reports: 'Reports',
    welcome: 'Welcome back', balance: 'Balance', withdraw: 'Withdraw', deposit: 'Deposit',
    searchServices: 'Search services...', allCategories: 'All Categories', bookNow: 'Book Now',
    confirmBooking: 'Confirm Booking', cancel: 'Cancel', confirm: 'Confirm', submit: 'Submit',
    subject: 'Subject', description: 'Description', date: 'Date', timeSlot: 'Time Slot',
    postNotice: 'Post Notice', priority: 'Priority', amount: 'Amount', method: 'Method'
  },
  hi: {
    dashboard: 'डैशबोर्ड', services: 'सेवाएं', complaints: 'शिकायतें', subscription: 'सदस्यता',
    notices: 'सूचनाएं', amenities: 'सुविधाएं', admin: 'एडमिन', wallet: 'वॉलेट', reports: 'रिपोर्ट',
    welcome: 'वापसी पर स्वागत है', balance: 'शेष राशि', withdraw: 'निकालें', deposit: 'जमा करें',
    searchServices: 'सेवाएं खोजें...', allCategories: 'सभी श्रेणियां', bookNow: 'अभी बुक करें',
    confirmBooking: 'बुकिंग की पुष्टि करें', cancel: 'रद्द करें', confirm: 'पुष्टि करें', submit: 'जमा करें',
    subject: 'विषय', description: 'विवरण', date: 'तारीख', timeSlot: 'समय स्लॉट',
    postNotice: 'सूचना पोस्ट करें', priority: 'प्राथमिकता', amount: 'राशि', method: 'विधि'
  }
  // Bengali, Marathi, etc. would follow the same pattern
};

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick, color = 'bg-black' }: { icon: any, label: string, active: boolean, onClick: () => void, color?: string }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? `${color} text-white shadow-lg shadow-black/10` 
        : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

interface ServiceCardProps {
  service: Service;
  onBook: (s: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps & { isPremium: boolean }> = ({ service, onBook, isPremium }) => {
  const getIcon = (name: string) => {
    if (name.includes('Electrician')) return <Wrench className="text-amber-500" />;
    if (name.includes('Plumber')) return <Droplets className="text-blue-500" />;
    if (name.includes('Milk')) return <Milk className="text-zinc-400" />;
    if (name.includes('Lawyer') || name.includes('RTI')) return <Scale className="text-indigo-500" />;
    if (name.includes('Doctor') || name.includes('Pharmacy') || name.includes('Lab') || name.includes('Patient') || name.includes('Nursing') || name.includes('Ambulance') || name.includes('Physio') || name.includes('Dietician') || name.includes('Psychologist')) return <Stethoscope className="text-rose-500" />;
    if (name.includes('Paint') || name.includes('Wash') || name.includes('Pest') || name.includes('Garden') || name.includes('Repair') || name.includes('Locksmith') || name.includes('Welding') || name.includes('Fabrication') || name.includes('Tank') || name.includes('Chimney') || name.includes('Sofa') || name.includes('Carpet')) return <Building2 className="text-emerald-500" />;
    if (name.includes('Security') || name.includes('CCTV') || name.includes('Fire')) return <ShieldCheck className="text-zinc-900" />;
    if (name.includes('Garbage') || name.includes('Cleaning') || name.includes('Sanitation')) return <Droplets className="text-cyan-500" />;
    if (name.includes('Internet') || name.includes('Technical') || name.includes('Broadband') || name.includes('App') || name.includes('Designer') || name.includes('Developer') || name.includes('Digital') || name.includes('SEO') || name.includes('Social')) return <Code className="text-purple-500" />;
    if (name.includes('Gas') || name.includes('Car') || name.includes('Courier') || name.includes('Driver') || name.includes('Transportation')) return <Car className="text-zinc-500" />;
    if (name.includes('Pet') || name.includes('Dog')) return <CheckCircle2 className="text-amber-500" />;
    if (name.includes('Maid') || name.includes('Cook') || name.includes('Laundry') || name.includes('Baby') || name.includes('Elderly')) return <Utensils className="text-orange-500" />;
    if (name.includes('Job') || name.includes('Event') || name.includes('Photo') || name.includes('Video') || name.includes('Architect') || name.includes('Engineer') || name.includes('CA') || name.includes('Consultant')) return <Briefcase className="text-blue-500" />;
    if (name.includes('Cosmetic') || name.includes('Beautician') || name.includes('Makeup') || name.includes('Tailor') || name.includes('Barber')) return <Scissors className="text-pink-500" />;
    if (name.includes('Grocery') || name.includes('General') || name.includes('Stationery') || name.includes('Book') || name.includes('Sabzi') || name.includes('Fruit') || name.includes('Shop') || name.includes('Flower') || name.includes('Gift') || name.includes('Hardware') || name.includes('Electrical') || name.includes('Plumbing')) return <ShoppingBag className="text-indigo-500" />;
    return <Wrench className="text-zinc-500" />;
  };

  const price = isPremium ? service.base_price / 2 : service.base_price;
  const isAvailable = service.is_available === 1;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className={`bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden ${!isAvailable ? 'opacity-60 grayscale' : ''}`}
    >
      {!isAvailable && (
        <div className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">
          Unavailable
        </div>
      )}
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${isAvailable ? 'bg-zinc-50' : 'bg-zinc-100'}`}>
          {getIcon(service.name)}
        </div>
        <div className="text-right">
          <span className="text-sm font-semibold text-zinc-900">₹{price}</span>
          {isPremium && isAvailable && (
            <p className="text-[10px] text-emerald-600 font-bold uppercase">50% Off</p>
          )}
        </div>
      </div>
      <h3 className="font-bold text-zinc-900 mb-1">{service.name}</h3>
      <p className="text-sm text-zinc-500 mb-4">{service.category}</p>
      <button 
        onClick={() => isAvailable && onBook(service)}
        disabled={!isAvailable}
        className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
          isAvailable 
            ? 'bg-zinc-900 text-white hover:bg-zinc-800' 
            : 'bg-zinc-200 text-zinc-500 cursor-not-allowed'
        }`}
      >
        {isAvailable ? 'Book Now' : 'Currently Unavailable'}
      </button>
    </motion.div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-100',
    assigned: 'bg-blue-50 text-blue-700 border-blue-100',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-100',
    open: 'bg-amber-50 text-amber-700 border-amber-100',
    resolved: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || 'bg-zinc-50 text-zinc-700'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'dashboard' | 'services' | 'complaints' | 'admin' | 'subscription' | 'notices' | 'amenities' | 'wallet' | 'reports'>('dashboard');
  const [lang, setLang] = useState('en');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [amenityBookings, setAmenityBookings] = useState<AmenityBooking[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [regReports, setRegReports] = useState<RegistrationReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUnavailable, setShowUnavailable] = useState(false);

  // Form states
  const [showBookingModal, setShowBookingModal] = useState<Service | null>(null);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showAmenityModal, setShowAmenityModal] = useState<Amenity | null>(null);
  const [showWalletModal, setShowWalletModal] = useState<'deposit' | 'withdraw' | null>(null);
  const [complaintForm, setComplaintForm] = useState({ subject: '', description: '' });
  const [amenityForm, setAmenityForm] = useState({ date: '', slot: '' });
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', priority: 'normal' });
  const [walletForm, setWalletForm] = useState({ amount: '', method: 'upi' });

  const t = (key: string) => TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en'][key] || key;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [uRes, sRes, bRes, cRes, nRes, aRes, abRes, tRes, rRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/services'),
        fetch('/api/bookings'),
        fetch('/api/complaints'),
        fetch('/api/notices'),
        fetch('/api/amenities'),
        fetch('/api/amenity-bookings'),
        fetch('/api/transactions'),
        fetch('/api/reports/registrations')
      ]);
      const uData = await uRes.json();
      const sData = await sRes.json();
      const bData = await bRes.json();
      const cData = await cRes.json();
      const nData = await nRes.json();
      const aData = await aRes.json();
      const abData = await abRes.json();
      const tData = await tRes.json();
      const rData = await rRes.json();

      setUsers(uData);
      setServices(sData);
      setBookings(bData);
      setComplaints(cData);
      setNotices(nData);
      setAmenities(aData);
      setAmenityBookings(abData);
      setTransactions(tData);
      setRegReports(rData);
      
      // Default to first user for demo
      if (!currentUser && uData.length > 0) {
        setCurrentUser(uData[1]); // Default to resident John Doe
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  const handleTransaction = async () => {
    if (!currentUser || !walletForm.amount) return;
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.id,
          amount: parseFloat(walletForm.amount),
          type: showWalletModal,
          method: walletForm.method
        })
      });
      if (res.ok) {
        setShowWalletModal(null);
        setWalletForm({ amount: '', method: 'upi' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookService = async (service: Service) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id, service_id: service.id })
      });
      if (res.ok) {
        setShowBookingModal(null);
        fetchData();
        setView('dashboard');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleService = async (id: number, currentStatus: number) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: currentStatus === 1 ? 0 : 1 })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileComplaint = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: currentUser.id, 
          subject: complaintForm.subject, 
          description: complaintForm.description 
        })
      });
      if (res.ok) {
        setShowComplaintModal(false);
        setComplaintForm({ subject: '', description: '' });
        fetchData();
        setView('complaints');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateBookingStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const resolveComplaint = async (id: number, message: string) => {
    try {
      await fetch(`/api/complaints/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved', resolution_message: message })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookAmenity = async () => {
    if (!currentUser || !showAmenityModal) return;
    try {
      const res = await fetch('/api/amenity-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: currentUser.id, 
          amenity_id: showAmenityModal.id,
          booking_date: amenityForm.date,
          time_slot: amenityForm.slot
        })
      });
      if (res.ok) {
        setShowAmenityModal(null);
        setAmenityForm({ date: '', slot: '' });
        fetchData();
        setView('dashboard');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostNotice = async () => {
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noticeForm)
      });
      if (res.ok) {
        setNoticeForm({ title: '', content: '', priority: 'normal' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">SocietyHub</h1>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
          <SidebarItem icon={LayoutDashboard} label={t('dashboard')} active={view === 'dashboard'} onClick={() => setView('dashboard')} color="bg-blue-600" />
          <SidebarItem icon={Wrench} label={t('services')} active={view === 'services'} onClick={() => setView('services')} color="bg-amber-600" />
          <SidebarItem icon={MessageSquareWarning} label={t('complaints')} active={view === 'complaints'} onClick={() => setView('complaints')} color="bg-rose-600" />
          <SidebarItem icon={Bell} label={t('notices')} active={view === 'notices'} onClick={() => setView('notices')} color="bg-indigo-600" />
          <SidebarItem icon={Building2} label={t('amenities')} active={view === 'amenities'} onClick={() => setView('amenities')} color="bg-emerald-600" />
          <SidebarItem icon={Wallet} label={t('wallet')} active={view === 'wallet'} onClick={() => setView('wallet')} color="bg-violet-600" />
          <SidebarItem icon={CreditCard} label={t('subscription')} active={view === 'subscription'} onClick={() => setView('subscription')} color="bg-cyan-600" />
          {currentUser?.role === 'admin' && (
            <>
              <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Admin Tools</div>
              <SidebarItem icon={ShieldCheck} label={t('admin')} active={view === 'admin'} onClick={() => setView('admin')} color="bg-zinc-900" />
              <SidebarItem icon={TrendingUp} label={t('reports')} active={view === 'reports'} onClick={() => setView('reports')} color="bg-emerald-700" />
            </>
          )}
        </nav>

        <div className="mt-auto pt-6 border-t border-zinc-100">
          <div className="flex items-center gap-2 mb-4 px-2">
            <Languages size={16} className="text-zinc-400" />
            <select 
              className="text-xs bg-transparent outline-none font-medium text-zinc-600 cursor-pointer"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
              <UserIcon size={20} className="text-zinc-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-900 truncate">{currentUser?.name}</p>
              <p className="text-xs text-zinc-500 truncate">{currentUser?.email}</p>
            </div>
          </div>
          <select 
            className="mt-4 w-full text-xs bg-zinc-50 border border-zinc-200 rounded-lg p-2"
            onChange={(e) => {
              const user = users.find(u => u.id === parseInt(e.target.value));
              if (user) setCurrentUser(user);
            }}
            value={currentUser?.id}
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
            ))}
          </select>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10">
        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <header className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-bold text-zinc-900">Welcome back, {currentUser?.name.split(' ')[0]}</h2>
                  <p className="text-zinc-500 mt-1">Here's what's happening in your society today.</p>
                </div>
                {currentUser?.is_premium ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-full">
                    <ShieldCheck className="text-amber-600" size={18} />
                    <span className="text-sm font-semibold text-amber-700">Premium Member</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => setView('subscription')}
                    className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-all"
                  >
                    Upgrade to Premium
                  </button>
                )}
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-600 p-6 rounded-2xl shadow-lg shadow-blue-200 text-white">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Clock size={20} />
                        </div>
                        <h3 className="font-semibold opacity-90">Active Bookings</h3>
                      </div>
                      <p className="text-3xl font-bold">
                        {bookings.filter(b => b.user_id === currentUser?.id && b.status !== 'completed' && b.status !== 'cancelled').length}
                      </p>
                    </div>
                    <div className="bg-emerald-600 p-6 rounded-2xl shadow-lg shadow-emerald-200 text-white">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <CheckCircle2 size={20} />
                        </div>
                        <h3 className="font-semibold opacity-90">Resolved Issues</h3>
                      </div>
                      <p className="text-3xl font-bold">
                        {complaints.filter(c => c.user_id === currentUser?.id && c.status === 'resolved').length}
                      </p>
                    </div>
                    <div className="bg-rose-600 p-6 rounded-2xl shadow-lg shadow-rose-200 text-white">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <CreditCard size={20} />
                        </div>
                        <h3 className="font-semibold opacity-90">Refunds Processed</h3>
                      </div>
                      <p className="text-3xl font-bold">
                        ₹{bookings.filter(b => b.user_id === currentUser?.id && b.refund_amount > 0).reduce((acc, curr) => acc + curr.refund_amount, 0)}
                      </p>
                    </div>
                  </div>

                  <section className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-zinc-900">Recent Activity</h3>
                      <button onClick={() => setView('services')} className="text-sm font-medium text-zinc-500 hover:text-zinc-900 flex items-center gap-1">
                        View all <ChevronRight size={16} />
                      </button>
                    </div>
                    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
                      <div className="divide-y divide-zinc-100">
                        {bookings.filter(b => b.user_id === currentUser?.id).slice(0, 5).map(booking => (
                          <div key={booking.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-600">
                                <Wrench size={20} />
                              </div>
                              <div>
                                <p className="font-semibold text-zinc-900">{booking.service_name}</p>
                                <p className="text-xs text-zinc-500">{new Date(booking.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              {booking.refund_amount > 0 && (
                                <span className="text-xs font-medium text-rose-600">Refunded ₹{booking.refund_amount}</span>
                              )}
                              <StatusBadge status={booking.status} />
                            </div>
                          </div>
                        ))}
                        {bookings.filter(b => b.user_id === currentUser?.id).length === 0 && (
                          <div className="p-12 text-center">
                            <p className="text-zinc-500">No recent activity found.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </div>

                <div className="space-y-8">
                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                      <Bell size={20} className="text-amber-500" />
                      Notice Board
                    </h3>
                    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden divide-y divide-zinc-50">
                      {notices.slice(0, 3).map(notice => (
                        <div key={notice.id} className="p-4 hover:bg-zinc-50 transition-colors">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`w-2 h-2 rounded-full ${notice.priority === 'high' ? 'bg-rose-500' : 'bg-blue-500'}`}></span>
                            <h4 className="font-bold text-sm text-zinc-900">{notice.title}</h4>
                          </div>
                          <p className="text-xs text-zinc-500 line-clamp-2">{notice.content}</p>
                          <p className="text-[10px] text-zinc-400 mt-2 uppercase font-medium">{new Date(notice.created_at).toLocaleDateString()}</p>
                        </div>
                      ))}
                      {notices.length === 0 && (
                        <div className="p-8 text-center text-zinc-400 text-sm">No new notices.</div>
                      )}
                    </div>
                  </section>

                  <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl text-white shadow-lg shadow-indigo-100">
                    <h4 className="font-bold mb-2">Need Help?</h4>
                    <p className="text-sm text-white/80 mb-4">Our support team is available 24/7 for premium members.</p>
                    <button 
                      onClick={() => setView('complaints')}
                      className="w-full py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold backdrop-blur-sm transition-all"
                    >
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'services' && (
            <motion.div 
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-zinc-900">{t('services')}</h2>
                  <p className="text-zinc-500 mt-1">Everything you need for your day-to-day operations.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input 
                      type="text" 
                      placeholder={t('searchServices')}
                      className="pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none w-full sm:w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select 
                    className="px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm outline-none cursor-pointer"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="All">{t('allCategories')}</option>
                    {Array.from(new Set(services.map(s => s.category))).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => setShowUnavailable(!showUnavailable)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      showUnavailable 
                        ? 'bg-black text-white' 
                        : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    {showUnavailable ? 'Hide Unavailable' : 'Show All'}
                  </button>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services
                  .filter(s => 
                    (selectedCategory === 'All' || s.category === selectedCategory) &&
                    (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
                    (showUnavailable || s.is_available === 1)
                  )
                  .map(service => (
                    <ServiceCard 
                      key={service.id} 
                      service={service} 
                      isPremium={!!currentUser?.is_premium}
                      onBook={(s) => setShowBookingModal(s)} 
                    />
                  ))}
              </div>
            </motion.div>
          )}

          {view === 'complaints' && (
            <motion.div 
              key="complaints"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <header className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-bold text-zinc-900">Complaints & RTI</h2>
                  <p className="text-zinc-500 mt-1">File a complaint or track your RTI status.</p>
                </div>
                <button 
                  onClick={() => setShowComplaintModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-xl font-semibold hover:from-rose-700 hover:to-rose-600 transition-all shadow-lg shadow-rose-200"
                >
                  <Plus size={20} />
                  New Complaint
                </button>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {complaints.filter(c => c.user_id === currentUser?.id).map(complaint => (
                  <div key={complaint.id} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${complaint.status === 'resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            <MessageSquare size={18} />
                          </div>
                          <h3 className="font-bold text-zinc-900">{complaint.subject}</h3>
                        </div>
                        <p className="text-sm text-zinc-600 line-clamp-2">{complaint.description}</p>
                        <div className="mt-4 flex items-center gap-4">
                          <span className="text-[10px] font-mono bg-zinc-50 px-2 py-1 rounded text-zinc-400">{complaint.complaint_number}</span>
                          <span className="text-[10px] text-zinc-400 uppercase font-medium">{new Date(complaint.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <StatusBadge status={complaint.status} />
                    </div>
                    {complaint.status === 'resolved' && (
                      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 size={16} className="text-emerald-600" />
                          <span className="text-sm font-bold text-emerald-900">Resolution</span>
                        </div>
                        <p className="text-sm text-emerald-800">{complaint.resolution_message}</p>
                      </div>
                    )}
                  </div>
                ))}
                {complaints.filter(c => c.user_id === currentUser?.id).length === 0 && (
                  <div className="md:col-span-2 text-center py-20 bg-white rounded-2xl border border-dashed border-zinc-200">
                    <MessageSquareWarning size={48} className="mx-auto text-zinc-300 mb-4" />
                    <p className="text-zinc-500">No complaints filed yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'subscription' && (
            <motion.div 
              key="subscription"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto space-y-8 text-center py-12"
            >
              <header className="space-y-4">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
                  <ShieldCheck size={32} />
                </div>
                <h2 className="text-4xl font-bold text-zinc-900">Premium Society Living</h2>
                <p className="text-lg text-zinc-500">Get exclusive benefits, priority service, and direct admin access.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm text-left">
                  <h3 className="text-xl font-bold text-zinc-900 mb-6">Standard</h3>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3 text-zinc-600">
                      <CheckCircle2 size={18} className="text-zinc-400" />
                      <span>Basic service booking</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-600">
                      <CheckCircle2 size={18} className="text-zinc-400" />
                      <span>Standard complaint resolution</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-600 opacity-50">
                      <XCircle size={18} />
                      <span>Priority scheduling</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-600 opacity-50">
                      <XCircle size={18} />
                      <span>Direct admin chat</span>
                    </li>
                  </ul>
                  <div className="text-3xl font-bold text-zinc-900 mb-6">Free</div>
                  <button className="w-full py-3 border border-zinc-200 rounded-xl font-semibold text-zinc-400 cursor-not-allowed">Current Plan</button>
                </div>

                <div className="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-3xl shadow-xl text-left relative overflow-hidden text-white">
                  <div className="absolute top-4 right-4 bg-amber-500 text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>
                  <h3 className="text-xl font-bold mb-6">Premium</h3>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3 font-medium">
                      <CheckCircle2 size={18} className="text-emerald-400" />
                      <span>Priority service booking</span>
                    </li>
                    <li className="flex items-center gap-3 font-medium">
                      <CheckCircle2 size={18} className="text-emerald-400" />
                      <span>24/7 Premium support</span>
                    </li>
                    <li className="flex items-center gap-3 font-medium">
                      <CheckCircle2 size={18} className="text-emerald-400" />
                      <span>Direct admin access</span>
                    </li>
                    <li className="flex items-center gap-3 font-medium">
                      <CheckCircle2 size={18} className="text-emerald-400" />
                      <span>Exclusive service discounts</span>
                    </li>
                  </ul>
                  <div className="text-3xl font-bold mb-6">₹1,999<span className="text-sm font-normal text-zinc-400">/yr</span></div>
                  <button className="w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-zinc-100 transition-all">Upgrade Now</button>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'notices' && (
            <motion.div 
              key="notices"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <header>
                <h2 className="text-3xl font-bold text-zinc-900">Society Notices</h2>
                <p className="text-zinc-500 mt-1">Stay updated with the latest announcements.</p>
              </header>

              <div className="grid grid-cols-1 gap-4">
                {notices.map(notice => (
                  <div key={notice.id} className={`p-6 rounded-2xl border ${notice.priority === 'high' ? 'bg-rose-50 border-rose-100' : 'bg-white border-zinc-100'} shadow-sm`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-bold ${notice.priority === 'high' ? 'text-rose-900' : 'text-zinc-900'}`}>{notice.title}</h3>
                      <span className="text-xs text-zinc-400">{new Date(notice.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className={`text-sm ${notice.priority === 'high' ? 'text-rose-800' : 'text-zinc-600'}`}>{notice.content}</p>
                    {notice.priority === 'high' && (
                      <div className="mt-4 flex items-center gap-2 text-rose-600">
                        <Bell size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">High Priority</span>
                      </div>
                    )}
                  </div>
                ))}
                {notices.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-zinc-200">
                    <Bell size={48} className="mx-auto text-zinc-300 mb-4" />
                    <p className="text-zinc-500">No notices at the moment.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'amenities' && (
            <motion.div 
              key="amenities"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <header>
                <h2 className="text-3xl font-bold text-zinc-900">{t('amenities')}</h2>
                <p className="text-zinc-500 mt-1">Book facilities for your personal use.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {amenities.map(amenity => (
                  <div key={amenity.id} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-zinc-50 rounded-xl text-zinc-600">
                        <Building2 size={24} />
                      </div>
                      <span className="text-xs font-semibold text-zinc-500">Capacity: {amenity.capacity}</span>
                    </div>
                    <h3 className="font-bold text-zinc-900 mb-1">{amenity.name}</h3>
                    <p className="text-sm text-zinc-500 mb-6 flex-1">{amenity.description}</p>
                    <button 
                      onClick={() => setShowAmenityModal(amenity)}
                      className="w-full py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
                    >
                      Book Facility
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'wallet' && (
            <motion.div 
              key="wallet"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <header className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-bold text-zinc-900">{t('wallet')}</h2>
                  <p className="text-zinc-500 mt-1">Manage your funds and withdrawals.</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowWalletModal('deposit')}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-medium"
                  >
                    <ArrowDownLeft size={18} />
                    {t('deposit')}
                  </button>
                  <button 
                    onClick={() => setShowWalletModal('withdraw')}
                    className="flex items-center gap-2 px-4 py-2 border border-zinc-200 bg-white text-zinc-900 rounded-xl text-sm font-medium"
                  >
                    <ArrowUpRight size={18} />
                    {t('withdraw')}
                  </button>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-gradient-to-br from-violet-600 to-indigo-700 text-white p-8 rounded-3xl shadow-xl shadow-indigo-200">
                  <p className="text-white/70 text-sm mb-1">{t('balance')}</p>
                  <h3 className="text-4xl font-bold">₹{currentUser?.balance?.toLocaleString() || '0'}</h3>
                  <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-emerald-300" />
                      <span className="text-xs text-white/70">Secure Wallet</span>
                    </div>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" className="h-4 invert opacity-70" alt="UPI" />
                  </div>
                </div>

                <div className="md:col-span-2 bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-zinc-50 flex justify-between items-center">
                    <h3 className="font-bold text-zinc-900">Recent Transactions</h3>
                    <button className="text-xs text-zinc-400 font-medium hover:text-zinc-900">View All</button>
                  </div>
                  <div className="divide-y divide-zinc-50">
                    {transactions.filter(t => t.user_id === currentUser?.id).map(tx => (
                      <div key={tx.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-xl ${tx.type === 'deposit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {tx.type === 'deposit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-900 capitalize">{tx.type}</p>
                            <p className="text-[10px] text-zinc-400 uppercase">{tx.method} • {new Date(tx.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <p className={`font-bold ${tx.type === 'deposit' ? 'text-emerald-600' : 'text-zinc-900'}`}>
                          {tx.type === 'deposit' ? '+' : '-'}₹{tx.amount}
                        </p>
                      </div>
                    ))}
                    {transactions.filter(t => t.user_id === currentUser?.id).length === 0 && (
                      <div className="p-12 text-center text-zinc-400 text-sm">No transactions yet.</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'reports' && currentUser?.role === 'admin' && (
            <motion.div 
              key="reports"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <header>
                <h2 className="text-3xl font-bold text-zinc-900">{t('reports')}</h2>
                <p className="text-zinc-500 mt-1">Analytical insights and registration reports.</p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm">
                  <h3 className="font-bold text-zinc-900 mb-6 flex items-center gap-2">
                    <TrendingUp size={20} className="text-emerald-600" />
                    User Registration Growth
                  </h3>
                  <div className="space-y-4">
                    {regReports.map(report => (
                      <div key={report.date} className="flex items-center gap-4">
                        <span className="text-xs font-medium text-zinc-400 w-24">{new Date(report.date).toLocaleDateString()}</span>
                        <div className="flex-1 h-2 bg-zinc-50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full" 
                            style={{ width: `${(report.count / Math.max(...regReports.map(r => r.count))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-zinc-900">{report.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm">
                  <h3 className="font-bold text-zinc-900 mb-6 flex items-center gap-2">
                    <FileText size={20} className="text-blue-600" />
                    System Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Total Users</p>
                      <p className="text-2xl font-bold text-zinc-900">{users.length}</p>
                    </div>
                    <div className="p-4 bg-zinc-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Total Services</p>
                      <p className="text-2xl font-bold text-zinc-900">{services.length}</p>
                    </div>
                    <div className="p-4 bg-zinc-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Active Bookings</p>
                      <p className="text-2xl font-bold text-zinc-900">{bookings.filter(b => b.status === 'pending' || b.status === 'assigned').length}</p>
                    </div>
                    <div className="p-4 bg-zinc-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Open Complaints</p>
                      <p className="text-2xl font-bold text-zinc-900">{complaints.filter(c => c.status === 'open').length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'admin' && currentUser?.role === 'admin' && (
            <motion.div 
              key="admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <header>
                <h2 className="text-3xl font-bold text-zinc-900">Admin Control Center</h2>
                <p className="text-zinc-500 mt-1">Manage society operations and resolve member issues.</p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="space-y-4">
                  <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                    <Briefcase size={20} />
                    Manage Service Availability
                  </h3>
                  <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
                    <div className="max-h-96 overflow-y-auto divide-y divide-zinc-100">
                      {services.map(service => (
                        <div key={service.id} className="p-4 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-zinc-900 text-sm">{service.name}</p>
                            <p className="text-xs text-zinc-500">{service.category}</p>
                          </div>
                          <button 
                            onClick={() => handleToggleService(service.id, service.is_available)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              service.is_available === 1
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100'
                            }`}
                          >
                            {service.is_available === 1 ? 'Available' : 'Unavailable'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                    <Wrench size={20} />
                    Service Requests
                  </h3>
                  <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
                    <div className="divide-y divide-zinc-100">
                      {bookings.map(booking => (
                        <div key={booking.id} className="p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-zinc-900">{booking.service_name}</p>
                              <p className="text-xs text-zinc-500">Requested by {booking.user_name}</p>
                            </div>
                            <StatusBadge status={booking.status} />
                          </div>
                          {booking.status === 'pending' && (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => updateBookingStatus(booking.id, 'assigned')}
                                className="flex-1 py-1.5 bg-zinc-900 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800"
                              >
                                Assign
                              </button>
                              <button 
                                onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                className="flex-1 py-1.5 border border-zinc-200 text-zinc-600 text-xs font-semibold rounded-lg hover:bg-zinc-50"
                              >
                                Cancel (Refund $20)
                              </button>
                            </div>
                          )}
                          {booking.status === 'assigned' && (
                            <button 
                              onClick={() => updateBookingStatus(booking.id, 'completed')}
                              className="w-full py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700"
                            >
                              Mark Completed
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                    <MessageSquareWarning size={20} />
                    Pending Complaints
                  </h3>
                  <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
                    <div className="divide-y divide-zinc-100">
                      {complaints.filter(c => c.status === 'open').map(complaint => (
                        <div key={complaint.id} className="p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-zinc-900">{complaint.subject}</p>
                              <p className="text-xs text-zinc-500">From {complaint.user_name} • {complaint.complaint_number}</p>
                            </div>
                            <StatusBadge status={complaint.status} />
                          </div>
                          <p className="text-sm text-zinc-600">{complaint.description}</p>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Resolution message..."
                              className="flex-1 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  resolveComplaint(complaint.id, (e.target as HTMLInputElement).value);
                                }
                              }}
                            />
                            <button 
                              onClick={(e) => {
                                const input = (e.currentTarget.previousSibling as HTMLInputElement);
                                resolveComplaint(complaint.id, input.value);
                              }}
                              className="px-4 py-1.5 bg-black text-white text-xs font-semibold rounded-lg"
                            >
                              Resolve
                            </button>
                          </div>
                        </div>
                      ))}
                      {complaints.filter(c => c.status === 'open').length === 0 && (
                        <div className="p-12 text-center text-zinc-500">All complaints resolved!</div>
                      )}
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                    <Bell size={20} />
                    Post New Notice
                  </h3>
                  <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
                    <input 
                      type="text" 
                      placeholder="Notice Title"
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none"
                      value={noticeForm.title}
                      onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                    />
                    <textarea 
                      placeholder="Notice Content"
                      rows={3}
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none resize-none"
                      value={noticeForm.content}
                      onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                    />
                    <div className="flex gap-4 items-center">
                      <select 
                        className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none"
                        value={noticeForm.priority}
                        onChange={(e) => setNoticeForm({ ...noticeForm, priority: e.target.value as 'normal' | 'high' })}
                      >
                        <option value="normal">Normal Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                      <button 
                        onClick={handlePostNotice}
                        disabled={!noticeForm.title || !noticeForm.content}
                        className="flex-1 py-2 bg-black text-white rounded-xl font-semibold hover:bg-zinc-800 disabled:opacity-50"
                      >
                        Post Notice
                      </button>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                    <Calendar size={20} />
                    Amenity Bookings
                  </h3>
                  <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
                    <div className="divide-y divide-zinc-100">
                      {amenityBookings.map(booking => (
                        <div key={booking.id} className="p-4 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-zinc-900">{booking.amenity_name}</p>
                            <p className="text-xs text-zinc-500">{booking.user_name} • {booking.booking_date} • {booking.time_slot}</p>
                          </div>
                          <StatusBadge status={booking.status} />
                        </div>
                      ))}
                      {amenityBookings.length === 0 && (
                        <div className="p-12 text-center text-zinc-500">No amenity bookings yet.</div>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showBookingModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">Confirm Booking</h3>
              <p className="text-zinc-500 mb-6">You are booking a <span className="font-semibold text-zinc-900">{showBookingModal.name}</span>. A service fee of <span className="font-semibold text-zinc-900">₹{currentUser?.is_premium ? showBookingModal.base_price / 2 : showBookingModal.base_price}</span> will be charged.</p>
              
              <div className="p-4 bg-zinc-50 rounded-2xl mb-8 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Service Price</span>
                  <span className="font-semibold text-zinc-900">₹{currentUser?.is_premium ? showBookingModal.base_price / 2 : showBookingModal.base_price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Platform Service Fee</span>
                  <span className="font-bold text-emerald-600">₹0</span>
                </div>
                <p className="text-[10px] text-zinc-400 italic mt-1">* Service charge is covered by the service provider.</p>
                {currentUser?.is_premium && (
                  <div className="flex justify-between text-xs text-emerald-600 font-bold">
                    <span>Premium Discount</span>
                    <span>-50%</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Refund Policy</span>
                  <span>100% Refund if cancelled</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowBookingModal(null)}
                  className="flex-1 py-3 border border-zinc-200 rounded-xl font-semibold text-zinc-600 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleBookService(showBookingModal)}
                  className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-zinc-800"
                >
                  Confirm & Pay
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showAmenityModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">Book {showAmenityModal.name}</h3>
              <p className="text-zinc-500 mb-6">Select your preferred date and time slot.</p>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-black outline-none"
                    value={amenityForm.date}
                    onChange={(e) => setAmenityForm({ ...amenityForm, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">Time Slot</label>
                  <select 
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-black outline-none"
                    value={amenityForm.slot}
                    onChange={(e) => setAmenityForm({ ...amenityForm, slot: e.target.value })}
                  >
                    <option value="">Select a slot</option>
                    <option value="06:00 - 08:00">06:00 - 08:00</option>
                    <option value="08:00 - 10:00">08:00 - 10:00</option>
                    <option value="10:00 - 12:00">10:00 - 12:00</option>
                    <option value="16:00 - 18:00">16:00 - 18:00</option>
                    <option value="18:00 - 20:00">18:00 - 20:00</option>
                    <option value="20:00 - 22:00">20:00 - 22:00</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowAmenityModal(null)}
                  className="flex-1 py-3 border border-zinc-200 rounded-xl font-semibold text-zinc-600 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBookAmenity}
                  disabled={!amenityForm.date || !amenityForm.slot}
                  className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Booking
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showComplaintModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-zinc-900 mb-6">File a Complaint / RTI</h3>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-black outline-none"
                    placeholder="e.g., Water leakage in block B"
                    value={complaintForm.subject}
                    onChange={(e) => setComplaintForm({ ...complaintForm, subject: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">Description</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-black outline-none resize-none"
                    placeholder="Provide details about your concern..."
                    value={complaintForm.description}
                    onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowComplaintModal(false)}
                  className="flex-1 py-3 border border-zinc-200 rounded-xl font-semibold text-zinc-600 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleFileComplaint}
                  disabled={!complaintForm.subject || !complaintForm.description}
                  className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showWalletModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-zinc-900 mb-2 capitalize">{showWalletModal} Funds</h3>
              <p className="text-zinc-500 mb-6">Enter the amount and select your preferred payment method.</p>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">{t('amount')} (₹)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-black outline-none"
                    placeholder="0.00"
                    value={walletForm.amount}
                    onChange={(e) => setWalletForm({ ...walletForm, amount: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">{t('method')}</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setWalletForm({ ...walletForm, method: 'upi' })}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${walletForm.method === 'upi' ? 'border-black bg-zinc-50' : 'border-zinc-100 hover:border-zinc-200'}`}
                    >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" className="h-4" alt="UPI" />
                      <span className="text-[10px] font-bold uppercase">UPI</span>
                    </button>
                    <button 
                      onClick={() => setWalletForm({ ...walletForm, method: 'razorpay' })}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${walletForm.method === 'razorpay' ? 'border-black bg-zinc-50' : 'border-zinc-100 hover:border-zinc-200'}`}
                    >
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                        <span className="text-xs font-bold text-blue-600">Razorpay</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase">Card/Netbanking</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowWalletModal(null)}
                  className="flex-1 py-3 border border-zinc-200 rounded-xl font-semibold text-zinc-600 hover:bg-zinc-50"
                >
                  {t('cancel')}
                </button>
                <button 
                  onClick={handleTransaction}
                  disabled={!walletForm.amount}
                  className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-zinc-800 disabled:opacity-50"
                >
                  {t('confirm')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
