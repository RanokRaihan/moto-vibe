import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className="w-full bg-gray-800  text-white  p-4">
        <div className="container mx-auto flex flex-wrap justify-between gap-6">
          <div className="sm:basis-1/2">
            <h2 className="text-xl text-green-400 my-4">About us</h2>
            <p className="text-gray-300 font-thin">
              We are a leading bike store offering a wide range of bicycles and
              accessories for all types of riders. Our mission is to provide
              high-quality products and exceptional customer service to help you
              enjoy your ride to the fullest.
            </p>
          </div>
          <div className="grow">
            <h2 className="text-xl text-green-400 my-4">Informations</h2>
            <ul className="text-gray-300">
              <li>
                <Link
                  to="/faq"
                  className="text-gray-300 font-thin space-y-2 underline underline-offset-4"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/delivery-info"
                  className="text-gray-300 font-thin space-y-2 underline underline-offset-4"
                >
                  Delivery Info
                </Link>
              </li>
              <li>
                <Link
                  to="/return-info"
                  className="text-gray-300 font-thin space-y-2 underline underline-offset-4"
                >
                  Return Info
                </Link>
              </li>
            </ul>
          </div>
          <div className="grow">
            <h2 className="text-xl text-green-400 my-4">Contact us</h2>
            <div className="text-gray-300 font-thin space-y-2">
              <p>123 Main Street, New York, NY 10001</p>
              <p>phone number: 123-456-7890</p>
              <p>email: motovibe@gmail.com </p>
            </div>
          </div>
        </div>
      </div>
      <p className="bg-gray-800/95 text-white p-2 text-center">
        © {new Date().getFullYear()}, All rights reserved
      </p>
    </footer>
  );
};

export default Footer;
