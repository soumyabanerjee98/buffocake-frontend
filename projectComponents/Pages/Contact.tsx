import React from 'react'

const Contact = () => {
  return (
    <>
      <div className="contact-container">
    <div className="map-container">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.5993088051373!2d88.419335576208!3d22.59408493218091!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0275a625c3e01b%3A0xb4ec924f67c61ff7!2sOnline%20Cake%20Delivery%20in%20Kolkata%20-%20Boffocakes!5e0!3m2!1sen!2sin!4v1686846730303!5m2!1sen!2sin"
        width="600"
        height="450"
        style={{ border: 0 }}
        loading="lazy"
      ></iframe>
    </div>
    <div className="contact-details">
      <h1>Boffocakes</h1>
      <p>Website: www.boffocakes.com</p>
      <p>Phone: (+91) 90519 18008</p>
      <p>Address: CG-244, CG Block, Sector II, Bidhannagar, Kolkata, West Bengal 700091</p>
    </div>

    <style jsx>{`
      .contact-container {
        display: flex;
        max-width: 900px;
        margin: 0 auto;
        padding: 40px;
        background-color: #ffffff;
        border-radius: 4px;
        font-family: "Montserrat", sans-serif;
      }

      .map-container {
        flex: 1;
        margin-right: 40px;
      }

      .contact-details {
        flex: 1;
      }

      h1 {
        font-size: 24px;
        margin-bottom: 20px;
        color: #6b2733;
      }

      p {
        margin-bottom: 10px;
      }
    `}</style>
  </div>
    </>
  )
}

export default Contact