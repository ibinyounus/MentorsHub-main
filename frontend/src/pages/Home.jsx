import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-sky-600">Mentors Hub</h1>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 transition"
              >
                লগইন করুন
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Banner Section */}
      <div className="bg-linear-to-r from-sky-500 to-sky-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            আপনার উজ্জ্বল ভবিষ্যতের <br /> নির্ভরযোগ্য সঙ্গী
          </h1>
          <p className="text-lg md:text-xl text-sky-100 mb-8 max-w-2xl mx-auto">
            আমরা প্রদান করি সেরা শিক্ষা এবং সঠিক নির্দেশনা, যা আপনাকে আপনার
            লক্ষ্যে পৌঁছাতে সাহায্য করবে। আজই আমাদের সাথে যুক্ত হোন।
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-sky-600 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-sky-50 transition transform hover:-translate-y-1"
          >
            যাত্রা শুরু করুন
          </button>
        </div>
      </div>

      {/* Our Courses Section */}
      <div className="py-16 px-4 bg-blue-400">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            আমাদের কোর্সসমূহ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "ষষ্ঠ – অষ্টম শ্রেণি (Class 6 – 8)",
                features: [
                  "নিয়মিত কোচিং",
                  "অভিজ্ঞ শিক্ষক দ্বারা পাঠদান",
                  "সকল বিভাগ (বিজ্ঞান / বাণিজ্য / মানবিক)",
                ],
                price: "৳ ১,৫০০ / মাস",
              },
              {
                title: "নবম – দশম শ্রেণি (Class 9 – 10)",
                features: [
                  "বোর্ড ফোকাসড নিয়মিত কোচিং",
                  "মডেল টেস্ট ও রিভিশন",
                  "বিজ্ঞান / বাণিজ্য / মানবিক",
                ],
                price: "৳ ২,০০০ / মাস",
              },
              {
                title: "দশম শ্রেণি স্পেশাল ব্যাচ",
                features: [
                  "বিশেষ প্রস্তুতি প্রোগ্রাম",
                  "পরীক্ষা ভিত্তিক গাইডলাইন",
                  "অতিরিক্ত কেয়ার ও সাপোর্ট",
                ],
                price: "৳ ২,৫০০",
                special: true,
              },
              {
                title: "একাদশ – দ্বাদশ (বিজ্ঞান বিভাগ)",
                features: [
                  "নিয়মিত ক্লাস",
                  "কনসেপ্ট ক্লিয়ারিং",
                  "পরীক্ষা ও মূল্যায়ন",
                ],
                price: "৳ ৩,০০০ / মাস",
              },
              {
                title: "একাদশ – দ্বাদশ (বাণিজ্য / মানবিক)",
                features: [
                  "নিয়মিত কোচিং",
                  "সহজ ও গুছানো পড়াশোনা",
                  "বিশেষ গাইডলাইন",
                ],
                price: "৳ ২,৫০০ / মাস",
              },
              {
                title: "Mentors Art Academy",
                features: [
                  "চিত্রাঙ্কন ও সৃজনশীল প্রশিক্ষণ",
                  "শিশু ও কিশোরদের জন্য উপযোগী",
                  "সৃজনশীলতা বিকাশ",
                ],
                price: "৳ ১,৫০০ / মাস",
              },
              {
                title: "Mentors English Academy",
                features: [
                  "ইংরেজি ভাষা দক্ষতা উন্নয়ন",
                  "গ্রামার ও স্পোকেন প্র্যাকটিস",
                  "বিশেষ ট্রেইনার দ্বারা ক্লাস",
                ],
                price: "৳ ১,৫০০ / মাস",
              },
            ].map((course, idx) => (
              <div
                key={idx}
                className={`relative bg-sky-50 p-6 rounded-2xl border ${course.special ? "border-sky-500 shadow-xl scale-105" : "border-sky-100"} hover:shadow-xl transition group flex flex-col`}
              >
                {course.special && (
                  <div className="absolute top-0 right-0 bg-sky-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    SPECIAL
                  </div>
                )}
                <div className="h-16 w-16 bg-sky-200 rounded-full mb-6 flex items-center justify-center self-center">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center min-h-14 flex items-center justify-center">
                  {course.title}
                </h3>
                <ul className="text-gray-600 space-y-2 mb-6 grow">
                  {course.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-sky-500 text-lg">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto text-center pt-4 border-t border-sky-200">
                  <p className="text-sky-700 font-extrabold text-xl">
                    {course.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      

{/* Our Branches Section */}
<div className="py-20 px-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
  <div className="max-w-7xl mx-auto">

    {/* Heading */}
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        type: "spring",
        stiffness: 55,
        damping: 18,
      }}
      className="text-4xl font-extrabold text-center text-white mb-14"
    >
      আমাদের শাখাসমূহ
    </motion.h2>

    {/* Branch Cards */}
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.18,
          },
        },
      }}
      className="grid grid-cols-1 md:grid-cols-2 gap-10 text-center max-w-4xl mx-auto"
    >
      {[
        {
          title: "ক্যাম্পাস–১",
          address:
            "বালুচড়া মোড়,\nক্যান্টনমেন্ট সুপার মার্কেট\n(উত্তর ভবন) ৩য় তলা।",
          phone: "০১৮৮৬২৯৫৯৮৮",
        },
        {
          title: "ক্যাম্পাস–২",
          address:
            "অক্সিজেন মোড়,\nবাগদাদ বেকারির বিপরীতে\n(তারেক ভবন) ৩য় তলা।",
          phone: "০১৬২০৫০৯৭৫২",
        },
      ].map((branch, idx) => (
        <motion.div
          key={idx}
          variants={{
            hidden: { opacity: 0, y: 22 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                type: "spring",
                stiffness: 50,
                damping: 20,
              },
            },
          }}
          whileHover={{
            y: -10,
            transition: {
              type: "spring",
              stiffness: 120,
              damping: 18,
            },
          }}
          className="relative group bg-white/10 backdrop-blur-lg p-10 rounded-2xl border border-white/10 shadow-lg hover:shadow-2xl transition"
        >
          {/* Glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition duration-300 blur-xl"></div>

          {/* Icon */}
          <div className="relative text-5xl mb-6 text-sky-400">
            📍
          </div>

          {/* Title */}
          <h3 className="relative text-2xl font-bold text-white mb-4">
            {branch.title}
          </h3>

          {/* Address */}
          <p className="relative text-gray-300 whitespace-pre-line leading-relaxed text-lg mb-6">
            {branch.address}
          </p>

          {/* Phone */}
          <p className="relative text-sky-400 font-bold text-xl">
            📞 {branch.phone}
          </p>
        </motion.div>
      ))}
    </motion.div>
  </div>
</div>


      {/* Our Team Section */}
      <div className="py-20 px-4 bg-linear-to-brom-white to-sky-50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold text-center text-gray-800 mb-4"
          >
            আমাদের টিম
          </motion.h2>

          <p className="text-center text-gray-500 mb-14">
            অভিজ্ঞ নেতৃত্ব ও দক্ষ শিক্ষকবৃন্দ
          </p>

          {/* Management */}
          <h3 className="text-2xl font-bold text-center mb-10 text-sky-700">
            🎖️ ম্যানেজমেন্ট টিম
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
            {[
              {
                name: "Bandhon Mallik",
                role: "Director, Oxygen Branch",
                exp: "15 Years Experience",
                phone: "01638278284",
              },
              {
                name: "Shamsul Huda Md Nahian",
                role: "Director, Baluchora Branch",
                exp: "5 Years Experience",
                phone: "01608-930284",
              },
              {
                name: "Irfan Bin Younus",
                role: "Director",
                exp: "7 Years Experience",
                phone: "01859295988",
              },
              {
                name: "Imrul Ahsan",
                role: "Assistant Director",
                exp: "3 Years Experience",
                phone: "016767732",
              },
            ].map((m, i) => (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  type: "spring",
                  stiffness: 60,
                  damping: 18,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.04,
                  transition: {
                    type: "spring",
                    stiffness: 120,
                    damping: 20,
                  },
                }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition"
              >
                <div className="absolute -top-4 right-4 bg-sky-600 text-white text-xs px-3 py-1 rounded-full shadow">
                  DIRECTOR
                </div>

                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-linear-to-br from-sky-400 to-sky-600 flex items-center justify-center text-3xl text-white shadow-md">
                  👑
                </div>

                <h4 className="text-lg font-bold text-gray-800">{m.name}</h4>
                <p className="text-sky-600 font-semibold">{m.role}</p>
                <p className="text-gray-500 text-sm mt-1">{m.exp}</p>
                <p className="text-gray-400 text-sm mt-2">📞 {m.phone}</p>
              </motion.div>
            ))}
          </div>

          {/* Teachers */}
          <h3 className="text-2xl font-bold text-center mb-10 text-gray-800">
            👨‍🏫 শিক্ষক প্যানেল
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "Rakib", subject: "Physics", exp: "5 Years Experience" },
              {
                name: "Rakib Hasan",
                subject: "Higher Math",
                exp: "7 Years Experience",
              },
              {
                name: "Ibrahim",
                subject: "English",
                exp: "7 Years Experience",
              },
              { name: "Shadat Hossain", subject: "IIUC – Pharmacy" },
              { name: "Saimon", subject: "CU – Chemistry" },
              { name: "Saiful", subject: "CU – Bangla" },
              { name: "Arfat", subject: "NU – English" },
              { name: "Salehin", subject: "CU – Physics" },
              { name: "Durjoy", subject: "CU – Biology" },
              { name: "Fahim", subject: "NU – English" },
            ].map((t, i) => (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  type: "spring",
                  stiffness: 60,
                  damping: 18,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.04,
                  transition: {
                    type: "spring",
                    stiffness: 120,
                    damping: 20,
                  },
                }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-sky-100 flex items-center justify-center text-2xl transition group-hover:scale-110">
                  👨‍🏫
                </div>
                <h4 className="font-bold text-gray-800">{t.name}</h4>
                <p className="text-sky-600 font-medium">{t.subject}</p>
                {t.exp && <p className="text-gray-500 text-sm mt-1">{t.exp}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-linear-to-b from-sky-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              type: "spring",
              stiffness: 60,
              damping: 18,
            }}
            className="text-4xl font-extrabold text-center text-gray-800 mb-14"
          >
            কেন আমরা সেরা?
          </motion.h2>

          {/* Features Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.12,
                },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
          >
            {[
              { title: "অভিজ্ঞ মেন্টর", icon: "👨‍🎓" },
              { title: "নিয়মিত পরীক্ষা", icon: "📝" },
              { title: "আধুনিক ক্লাসরুম", icon: "🖥️" },
              { title: "সার্বক্ষণিক গাইডলাইন", icon: "💡" },
            ].map((f, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 55,
                      damping: 20,
                    },
                  },
                }}
                whileHover={{
                  y: -10,
                  scale: 1.05,
                  transition: {
                    type: "spring",
                    stiffness: 120,
                    damping: 18,
                  },
                }}
                className="group relative bg-white rounded-2xl p-8 text-center border border-sky-100 shadow-sm hover:shadow-2xl transition"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-sky-400/10 to-sky-600/10 opacity-0 group-hover:opacity-100 transition duration-300 blur-xl"></div>

                {/* Icon */}
                <div className="relative w-20 h-20 mx-auto mb-6 rounded-full bg-linear-to-br from-sky-400 to-sky-600 flex items-center justify-center text-3xl text-white shadow-lg">
                  {f.icon}
                </div>

                {/* Title */}
                <h3 className="relative font-bold text-xl text-gray-800">
                  {f.title}
                </h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-sky-400">
              Mentors Hub
            </h2>
            <p className="text-gray-400 leading-relaxed">
              শিক্ষা ও প্রযুক্তির সমন্বয়ে আমরা গড়ছি আগামীর ভবিষ্যৎ। আমাদের
              লক্ষ্য প্রতিটি ছাত্রছাত্রীর মেধা বিকাশে সহায়তা করা।
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2 inline-block">
              দ্রুত লিংক
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/login" className="hover:text-sky-400 transition">
                  লগইন
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-sky-400 transition">
                  ভর্তি তথ্য
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-400 transition">
                  নোটিশ বোর্ড
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2 inline-block">
              যোগাযোগ
            </h3>
            <p className="text-gray-300 font-bold text-lg mb-2">
              ক্যাম্পাস-১: ০১৮৮৬২৯৫৯৮৮
            </p>
            <p className="text-gray-300 font-bold text-lg mb-2">
              ক্যাম্পাস-২: ০১৬২০৫০৯৭৫২
            </p>
            <p className="text-gray-400 mt-4">
              বালুচড়া ও অক্সিজেন মোড়, চট্টগ্রাম
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          &copy; ২০২৬ Mentors Hub। সর্বস্বত্ব সংরক্ষিত।
        </div>
      </footer>
    </div>
  );
}
