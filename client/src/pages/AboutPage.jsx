export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-hero">
          <div className="hero-content">
            <h1 className="about-title">Over Joanna</h1>
          </div>
        </div>

        <div className="about-content">
          <section className="about-section">
            <h2>Over mij</h2>
            <p>Learning React, Strapi en Netlify. Dit is mijn eerste project met deze stack.</p>
          </section>

          <section className="about-section">
            <h2>Dit Project</h2>
            <p>
              Voor dit project ben ik crazy gegaan met de CSS - volledig gebaseerd op poster styling
              met dikke randen, felle kleuren en vette typografie.
            </p>
            <p>
              Een Kanban Project Management System gebouwd met React frontend en Strapi backend.
            </p>
            <p>Deployed op Netlify (frontend) en Render (backend API).</p>
          </section>

          <section className="about-section">
            <h2>Contact</h2>
            <div className="contact-info">
              <div className="contact-card">
                <div className="contact-icon">@</div>
                <div>
                  <h4>Mail</h4>
                  <p>please don't</p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">⚡</div>
                <div>
                  <h4>Linkedin</h4>
                  <p>@joannajodel</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
