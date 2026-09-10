import React from "react";
import doctorTablet from "../../assets/img/doctor-tablet.jpg";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {

    const navigate = useNavigate()
    return (
        <main>
            <header className="site-header">
                <div className="header-container">
                    {/* Logo */}
                    <a href="/client/public" className="logo">
                        <span className="logo-icon">✚</span>
                        <span>ArogyaAI</span>
                    </a>

                    {/* Navigation */}
                    <nav className="nav">

                        <ul className="nav-menu">
                            <li>
                                <Link to="/Home">Home</Link>
                            </li>

                            <li>
                                <Link to="/about">About</Link>
                            </li>

                            <li>
                                <Link to="/contact">Contact Us</Link>
                            </li>
                        </ul>


                    </nav>

                    {/* Actions */}
                    <div className="header-actions">

                        <button onClick={() => navigate('/login')} className="cta-btn">Login/SignUp</button>
                    </div>

                    {/* Mobile menu button */}
                    <button className="menu-btn" aria-label="Open menu">
                        ☰
                    </button>
                </div>
            </header>
            <section className="hero">
                <div className="hero-content">
                    <span className="eyebrow">YOUR HEALTH. OUR PRIORITY.</span>

                    <h1>
                        ArogyaAI Coverage
                        <br />
                        for a Healthier Tomorrow
                    </h1>

                    <p>
                        Get the right ArogyaAI plan for your needs. Access quality care,
                        trusted doctors, and the coverage you deserve — all in one place.
                    </p>

                    <div className="hero-buttons">
                        <a href="#plans" className="primary-btn">
                            Explore Plans
                            <span>→</span>
                        </a>

                        <a href="#learn-more" className="secondary-btn">
                            Learn More
                        </a>
                    </div>
                </div>

                <div className="hero-image">
                    <img
                        src={doctorTablet} alt="Doctor with tablet"
                    />
                </div>
            </section>

            <section className="why-medicare">
                <div className="section-heading">
                    <span className="eyebrow">WHY CHOOSE ArogyaAI?</span>

                    <h2>Trusted Coverage. Better Care.</h2>

                    <p>
                        ArogyaAI helps you stay healthy, independent, and confident —
                        at every stage of life.
                    </p>
                </div>

                <div className="benefits">
                    <div className="benefit">
                        <div className="benefit-icon">♡</div>
                        <h3>Comprehensive Coverage</h3>
                        <p>
                            From preventive care to hospital stays, ArogyaAI has you
                            covered.
                        </p>
                    </div>

                    <div className="benefit">
                        <div className="benefit-icon">♙</div>
                        <h3>Access to Trusted Doctors</h3>
                        <p>
                            Find a network of experienced healthcare providers near you.
                        </p>
                    </div>

                    <div className="benefit">
                        <div className="benefit-icon">▱</div>
                        <h3>Affordable Options</h3>
                        <p>
                            Choose from a range of plans that fit your budget and needs.
                        </p>
                    </div>

                    <div className="benefit">
                        <div className="benefit-icon">♥</div>
                        <h3>Better Health & Wellbeing</h3>
                        <p>
                            Get the care you need to live a healthier, happier life.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
