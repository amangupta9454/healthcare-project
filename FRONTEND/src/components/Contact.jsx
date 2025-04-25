const Contact = () => {
  return (
    <div className=" min-h-screen md:min-h-[70vh] bg-gradient-to-l from-teal-900 via-blue-900 to-teal-900 text-gray-800 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white underline decoration-teal-500 underline-offset-4">
            Contact Us
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-white max-w-2xl mx-auto">
            We're here to assist you. Reach out to us today!
          </p>
        </div>
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-lg font-medium text-white mb-4">Get in touch with us:</p>
          <ul className="space-y-3 text-base sm:text-lg">
            <li>
              Email:{' '}
              <a
                href="mailto:ag0567688@gmail.com"
                className="text-teal-600 hover:text-teal-800 transition-colors duration-200a
                font-medium"
              >
                ag0567688@gmail.com
              </a>
            </li>
            <li>
              Mobile:{' '}
              <a
                href="tel:+919560472926"
                className="text-teal-600 hover:text-teal-800 transition-colors duration-200 font-medium"
              >
                +91 9560472926
              </a>
            </li>
            <li>
              WhatsApp:{' '}
              <a
                href="https://wa.me/919560472926"
                className="text-teal-600 hover:text-teal-800 transition-colors duration-200 font-medium"
              >
                +91 9560472926
              </a>
            </li>
          </ul>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Contact Form */}
          <div className="w-full lg:w-1/2 bg-white rounded-2xl shadow-lg p-6 sm:p-8 transition-all duration-300">
            <form action="https://getform.io/f/amddkgwb" method="POST" className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="Your email"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
                />
              </div>
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  id="mobile"
                  required
                  placeholder="Your mobile number"
                  pattern="^[7-9][0-9]{9}$"
                  title="Enter a valid Indian mobile number starting with 7, 8, or 9"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  id="gender"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-gray-800"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  required
                  placeholder="Enter your message"
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-gray-800 placeholder-gray-400 resize-y"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all duration-200"
              >
                Send Message
              </button>
            </form>
          </div>
          {/* Address and Map */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Our Address</h3>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Plot No. 766, 26th KM Milestone, NH-9,<br />
                Ghaziabad, Uttar Pradesh – 201015
              </p>
              <div className="mt-6 rounded-xl overflow-hidden shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.545251972305!2d77.49128877566565!3d28.673331882226368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf2c4cac27f99%3A0xd9961659aee6d5b2!2sHi-Tech%20Institute%20of%20Engineering%20%26%20Technology!5e0!3m2!1sen!2sin!4v1739723721387!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;