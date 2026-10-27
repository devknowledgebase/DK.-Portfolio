import { useState } from 'react';
import './Footer.css'
import { Phone, Email, Github, Linkdin, X } from './assets/icons.jsx'

function Footer() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle');
    const [copied, setCopied] = useState(false);
    const [copiedPhone, setCopiedPhone] = useState(false);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const copyPhoneToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedPhone(true);
            setTimeout(() => setCopiedPhone(false), 2000);
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.message.trim()) newErrors.message = 'Message is required';
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setStatus('submitting');
        const { getSupabase } = await import('./utils/supabase');
        const supabase = await getSupabase();
        const { error } = await supabase
            .from('contact_messages')
            .insert([{ name: formData.name, email: formData.email, message: formData.message }]);

        if (error) {
            console.error('Supabase insert error:', error);
            setStatus('error');
        } else {
            setStatus('success');
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'contact_form_submit',
                form_type: 'contact_messages' // Optional: metadata for GA4
            });

            setFormData({ name: '', email: '', message: '' });
        }
    };

    return (
        <>
            <div className="footer" id="Footer">
                {/* <Logo style={{width: '140px', color:'var(--neutral-0)', margin:'72px 0px 0px 72px'}}/> */}
                <p className="contact-text-head">
                    Contect Me
                </p>
                <div className='footer-socials'>
                    <div className="social-icon-wraper">
                        <div className='social-icon-wraper-content'>
                            <Email style={{ width: 'var(--primary-icon-size)', height: 'var(--primary-icon-size)' }} />
                            <div className="social-text">
                                <span style={{ fontWeight: '400', fontSize: 'var(--primary-font-size)', color: '#E5E7EB' }}>
                                    Email
                                </span>
                                <span
                                    className="social-value"
                                    onClick={() => copyToClipboard('kumard.07.dev@gmail.com')}
                                    title="Click to copy"
                                    style={{
                                        fontSize: 'var(--secondary-font-size)',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        userSelect: 'none',
                                        transition: 'opacity 0.2s',
                                        opacity: copied ? 1 : 1,
                                    }}
                                >
                                    {copied ? '✓ Copied!' : 'kumard.07.dev@gmail.com'}
                                </span>
                            </div>
                        </div>
                        <div className='social-icon-wraper-content'>
                            <Phone style={{ width: 'var(--primary-icon-size)', height: 'var(--primary-icon-size)' }} />
                            <div className="social-text">
                                <span style={{ fontWeight: '400', fontSize: 'var(--primary-font-size)', color: '#E5E7EB' }}>
                                    Phone
                                </span>
                                <span
                                    className="social-value"
                                    onClick={() => copyPhoneToClipboard('+91-8287215900')}
                                    title="Click to copy"
                                    style={{
                                        fontSize: 'var(--secondary-font-size)',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        userSelect: 'none',
                                        transition: 'opacity 0.2s',
                                        opacity: copiedPhone ? 1 : 1,
                                    }}
                                >
                                    {copiedPhone ? '✓ Copied!' : '+91-8287215900'}
                                </span>
                            </div>
                        </div>
                        <div className='social-icon-wraper-links'>
                            <a href="https://www.linkedin.com/in/kumaardev/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                <Linkdin style={{ width: 'var(--secondary-icon-size)', height: 'var(--secondary-icon-size)' }} />
                            </a>
                            <a href="http://github.com/devknowledgebase" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                                <Github style={{ width: 'var(--secondary-icon-size)', height: 'var(--secondary-icon-size)' }} />
                            </a>
                            <a href="https://x.com/Dev3807" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                                <X style={{ width: 'var(--secondary-icon-size)', height: 'var(--secondary-icon-size)' }} />
                            </a>
                        </div>
                    </div>
                    <div className="contact-section">
                        {status === 'success' ? (
                            <div className="contact-success" role="alert">
                                <p>Thanks for reaching out! I'll get back to you soon.</p>
                                <button type="button" onClick={() => setStatus('idle')} className="submit-btn">
                                    Send another message
                                </button>
                            </div>
                        ) : status === 'error' ? (
                            <div className="contact-success" role="alert">
                                <p style={{ color: 'var(--neutral-40)' }}>Something went wrong. Please try again or email me directly.</p>
                                <button type="button" onClick={() => setStatus('idle')} className="submit-btn">
                                    Try again
                                </button>
                            </div>
                        ) : (
                            <form className="contact-form" onSubmit={handleSubmit} noValidate>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="name">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            aria-invalid={!!errors.name}
                                            aria-describedby={errors.name ? "name-error" : undefined}
                                            className={errors.name ? 'error' : ''}
                                        />
                                        {errors.name && <span id="name-error" className="error-text" role="alert">{errors.name}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            aria-invalid={!!errors.email}
                                            aria-describedby={errors.email ? "email-error" : undefined}
                                            className={errors.email ? 'error' : ''}
                                        />
                                        {errors.email && <span id="email-error" className="error-text" role="alert">{errors.email}</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="4"
                                        aria-invalid={!!errors.message}
                                        aria-describedby={errors.message ? "message-error" : undefined}
                                        className={errors.message ? 'error' : ''}
                                    />
                                    {errors.message && <span id="message-error" className="error-text" role="alert">{errors.message}</span>}
                                </div>

                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={status === 'submitting'}
                                    aria-busy={status === 'submitting'}
                                >
                                    {status === 'submitting' ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footer;
