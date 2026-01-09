import { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mob: '',
    ans: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = (fieldName) => {
    const value = formData[fieldName];
    if (!value || value.trim() === '') {
      setErrors(prev => ({
        ...prev,
        [fieldName]: 'This field is required'
      }));
      return false;
    }
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate all fields
    const fields = ['name', 'email', 'mob', 'ans'];
    const isValid = fields.every(field => validate(field));

    if (isValid) {
      console.log('Form submitted:', formData);
      // Handle form submission here
    }
  };

  return (
    <section id="contact" className="w-full min-h-screen antialiased bg-(--black-color) relative py-20 px-6 contact-section">
      <div className="outer">
        <div className="inner">
          <div className="container mx-auto">
            <div className=" mb-12">
              <div className="font-bold section-heading">
                <h2>Contact</h2>&nbsp;
                <h2 className="gradient-word">Us</h2>
              </div>
            </div>
 
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-14">
              <div className="w-full">
                <h3 className="text-2xl font-bold mb-6 gradient-word">Send us a message</h3>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={() => validate('name')}
                      placeholder=""
                      className="peer px-3 pt-6 pb-2 w-full rounded-2xl border border-purple-700 bg-transparent focus:outline-none focus:border-purple-500 text-base text-white placeholder-transparent"
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-3 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-500"
                    >
                      Full Name<span className="text-purple-500"> *</span>
                    </label>
                    {errors.name && <span className="text-purple-500 text-sm mt-1 block">{errors.name}</span>}
                  </div>
 
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={() => validate('email')}
                        placeholder=""
                        className="peer px-3 pt-6 pb-2 w-full rounded-2xl border border-purple-700 bg-transparent focus:outline-none focus:border-purple-500 text-base text-white placeholder-transparent"
                      />
                      <label
                        htmlFor="email"
                        className="absolute left-3 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-500"
                      >
                        Email<span className="text-purple-500"> *</span>
                      </label>
                      {errors.email && <span className="text-purple-500 text-sm mt-1 block">{errors.email}</span>}
                    </div>
                    <div className="relative">
                      <input
                        type="tel"
                        id="mob"
                        name="mob"
                        value={formData.mob}
                        onChange={handleChange}
                        onBlur={() => validate('mob')}
                        placeholder=""
                        className="peer px-3 pt-6 pb-2 w-full rounded-2xl border border-purple-700 bg-transparent focus:outline-none focus:border-purple-500 text-base text-white placeholder-transparent"
                      />
                      <label
                        htmlFor="mob"
                        className="absolute left-3 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-500"
                      >
                        Phone Number<span className="text-purple-500"> *</span>
                      </label>
                      {errors.mob && <span className="text-purple-500 text-sm mt-1 block">{errors.mob}</span>}
                    </div>
                  </div>
 
                  <div className="relative">
                    <textarea
                      id="ans"
                      name="ans"
                      value={formData.ans}
                      onChange={handleChange}
                      onBlur={() => validate('ans')}
                      placeholder=""
                      rows="4"
                      className="peer px-3 pt-6 pb-2 w-full rounded-2xl border border-purple-700 bg-transparent focus:outline-none focus:border-purple-500 text-base text-white placeholder-transparent resize-none"
                    />
                    <label
                      htmlFor="ans"
                      className="absolute left-3 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-500"
                    >
                      Message<span className="text-purple-500"> *</span>
                    </label>
                    {errors.ans && <span className="text-purple-500 text-sm mt-1 block">{errors.ans}</span>}
                  </div>
 
                  <div className="pt-6">
                    <button
                      type="submit"
                      className="w-full btn-primary "
                    >
                      Send Message
                    </button>
                  </div>
                </form>
 
              </div>
 
              <div className="contact-get-in-touch w-full">
                <h3 className="text-2xl font-bold mb-6 gradient-word">Get in touch</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 gradient-word">Address</h4>
                    <p>1st Floor, Lot 3513, Block 5 MCLD, Lorong Aster 1, 101 Commercial Centre, 98000 Miri, Sarawak, Malaysia</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2 gradient-word">Email</h4>
                    <p>hello@zenarajaya.com</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2 gradient-word">Phone</h4>
                    <p>+60 12-883 5193</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
