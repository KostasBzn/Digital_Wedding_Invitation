import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, Check } from "lucide-react";
import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { useGuestContext } from "../context/GuestContext";
import floral from "../assets/an1.png";

function Invitation() {
  const [searchParams] = useSearchParams();
  const isLimited = searchParams.get("v") === "1"; // church-only variant

  const { addGuest, loading, error } = useGuestContext();
  const [form, setForm] = useState({
    name: "",
    surname: "",
    isAttending: true,
    adultsCount: 1,
    kidsCount: 0,
  });
  const [submitted, setSubmitted] = useState(false);
  const [activePin, setActivePin] = useState(null);

  // enviroment variables
  const apiKey = import.meta.env.VITE_GOOGLE_API;
  const hisPhone = import.meta.env.VITE_HIS_PHONE;
  const herPhone = import.meta.env.VITE_HER_PHONE;
  const hisInsta = import.meta.env.VITE_HIS_INSTA;
  const herInsta = import.meta.env.VITE_HER_INSTA;
  const hisFb = import.meta.env.VITE_HIS_FB;
  const herFb = import.meta.env.VITE_HER_FB;
  const IBAN = import.meta.env.VITE_IBAN;

  // coordinates for the locations
  const CHURCH_COORDS = { lat: 37.816697, lng: 23.778526 };
  const RESTAURANT_COORDS = { lat: 37.853046, lng: 23.813512 };

  // center the map between the two pings
  const mapCenter = isLimited
    ? CHURCH_COORDS
    : {
        lat: (CHURCH_COORDS.lat + RESTAURANT_COORDS.lat) / 2,
        lng: (CHURCH_COORDS.lng + RESTAURANT_COORDS.lng) / 2,
      };

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      surname: form.surname,
      isAttending: form.isAttending,
      adultsCount: form.isAttending ? Number(form.adultsCount) || 1 : 0,
      kidsCount: form.isAttending ? Number(form.kidsCount) || 0 : 0,
    };
    const result = await addGuest(payload);
    if (result) setSubmitted(true);
  };

  return (
    <div className="bg-page-bg min-h-screen text-gray-700">
      {/* Hero */}
      <header className="text-center pt-10 pb-10 px-4 relative">
        <div className="relative h-80 sm:h-125 flex items-center justify-center">
          <img
            src={floral}
            alt=""
            className="absolute inset-0 w-full h-full object-contain animate-fade-scale"
          />
          <h1 className="relative text-3xl sm:text-5xl text-black font-display animate-fade-up">
            ΧΡΗΣΤΟΣ &amp; ΣΑΜΨΟΥΛΑ
          </h1>
        </div>

        <p className="text-md sm:text-lg tracking-wide sm:tracking-widest text-black mt-2">
          ΜΕ ΧΑΡΑ ΣΑΣ ΠΡΟΣΚΑΛΟΥΜΕ ΣΤΟ ΓΑΜΟ ΜΑΣ
        </p>

        <p className="text-md sm:text-lg tracking-wide sm:tracking-widest text-black mt-2">
          ΣΑΒΒΑΤΟ 5 ΔΕΚΕΜΒΡΙΟΥ 2026 | 18:30
        </p>
        <div className="text-center mt-6 sm:mt-8 space-y-3 sm:space-y-4">
          <div>
            <p className="text-xs sm:text-sm tracking-wide sm:tracking-widest text-black font-medium">
              ΟΙΚΟΓΕΝΕΙΕΣ:
            </p>
            <p className="text-xs sm:text-sm tracking-wide sm:tracking-widest text-gray-500 mt-1">
              ΚΩΝΣΤΑΝΤΙΝΟΣ ΒΑΣΙΛΕΙΑΔΗΣ &amp; ΕΥΑΓΓΕΛΙΑ ΔΑΝΕΖΗ
            </p>
            <p className="text-xs sm:text-sm tracking-wide sm:tracking-widest text-gray-500">
              ΘΕΟΔΩΡΟΣ ΑΝΔΡΙΟΠΟΥΛΟΣ &amp; ΣΤΑΜΑΤΙΑ ΛΑΜΠΡΟΠΟΥΛΟΥ
            </p>
          </div>

          <div>
            <p className="text-xs sm:text-sm tracking-wide sm:tracking-widest text-black font-medium">
              ΚΟΥΜΠΑΡΕΣ:
            </p>
            <p className="text-xs sm:text-sm tracking-wide sm:tracking-widest text-gray-500 mt-1">
              ΑΝΝΑ ΦΑΡΜΑΚΗ &amp; ΑΣΗΜΙΝΑ ΑΝΔΡΙΟΠΟΥΛΟΥ
            </p>
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav className="flex flex-wrap justify-center gap-3 sm:gap-8 text-xs sm:text-m tracking-wide text-primary border-t border-b border-gray-300 py-2.5 sm:py-3 px-4">
        {!isLimited && (
          <a href="#rsvp" className="hover:opacity-70">
            RSVP
          </a>
        )}
        <a href="#teleti" className="hover:opacity-70">
          ΤΕΛΕΤΗ
        </a>
        {!isLimited && (
          <a href="#dexiosi" className="hover:opacity-70">
            ΔΕΞΙΩΣΗ
          </a>
        )}
        <a href="#lista" className="hover:opacity-70">
          ΛΙΣΤΑ ΓΑΜΟΥ
        </a>
        <a href="#epikoinonia" className="hover:opacity-70">
          ΕΠΙΚΟΙΝΩΝΙΑ
        </a>
      </nav>

      {/* RSVP Form */}
      {!isLimited && (
        <section id="rsvp" className="max-w-md mx-auto px-4 py-16">
          <h2 className="text-2xl text-primary text-center mb-2">
            Ο ΓΑΜΟΣ ΜΑΣ
          </h2>
          <p className="text-m text-gray-500 text-center mb-8">
            Θα χαρούμε πολύ να μας ενημερώσετε για την παρουσία σας έως τις 20
            Νοεμβρίου 2026
          </p>

          {submitted ? (
            <div className="text-center bg-white rounded-xl p-6 border border-gray-200">
              <Check size={32} className="mx-auto mb-2 text-primary-light" />
              <p className="text-primary font-medium">
                Ευχαριστούμε για την απάντησή σας!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-s text-gray-500 block mb-1">
                    Όνομα *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full border-b border-gray-400 bg-transparent py-1 outline-none focus:border-primary-light"
                  />
                </div>
                <div>
                  <label className="text-s text-gray-500 block mb-1">
                    Επώνυμο *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.surname}
                    onChange={(e) => handleChange("surname", e.target.value)}
                    className="w-full border-b border-gray-400 bg-transparent py-1 outline-none focus:border-primary-light"
                  />
                </div>
              </div>

              <div>
                <label className="text-s text-gray-500 block mb-2">
                  Θα παρευρεθείτε; *
                </label>
                <div className="flex gap-6 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="attending"
                      checked={form.isAttending === true}
                      onChange={() => handleChange("isAttending", true)}
                      className="accent-primary-light"
                    />
                    Ναι
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="attending"
                      checked={form.isAttending === false}
                      onChange={() => handleChange("isAttending", false)}
                      className="accent-primary-light"
                    />
                    Όχι
                  </label>
                </div>
              </div>

              {form.isAttending && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-s text-gray-500 block mb-1">
                      Ενήλικες *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={form.adultsCount}
                      onChange={(e) =>
                        handleChange("adultsCount", e.target.value)
                      }
                      className="w-full border-b border-gray-400 bg-transparent py-1 outline-none focus:border-primary-light"
                    />
                  </div>
                  <div>
                    <label className="text-s text-gray-500 block mb-1">
                      Παιδιά
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.kidsCount}
                      onChange={(e) =>
                        handleChange("kidsCount", e.target.value)
                      }
                      className="w-full border-b border-gray-400 bg-transparent py-1 outline-none focus:border-primary-light"
                    />
                  </div>
                </div>
              )}

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white rounded-full py-3 mt-4 flex items-center justify-center gap-2 disabled:opacity-60 hover:opacity-90 transition-opacity"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  "Υποβολή"
                )}
              </button>
            </form>
          )}
        </section>
      )}

      {/* Venues */}
      <section
        id="teleti"
        className={`max-w-3xl mx-auto px-4 py-12 grid gap-8 text-center border-t border-gray-300 ${
          isLimited
            ? "grid-cols-1 justify-items-center"
            : "sm:grid-cols-2 grid-cols-1"
        }`}
      >
        <div>
          <h3 className="text-xl text-primary mb-2">ΤΕΛΕΤΗ</h3>
          <p className="text-m font-medium">Ιερός Ναός Παναγίας Φανερωμένης</p>
          <p className="text-s text-gray-500">
            Αιόλου 8, Βουλιαγμένη 166 71, Αθήνα
          </p>
        </div>
        {!isLimited && (
          <div id="dexiosi">
            <h3 className="text-xl text-primary mb-2">ΔΕΞΙΩΣΗ</h3>
            <p className="text-m font-medium">Κτήμα Ιβέλια</p>
            <p className="text-s text-gray-500">
              Λαμπτρών, Κορωπί 166 72, Ελλάδα
            </p>
          </div>
        )}
      </section>

      {/* Map */}
      <div className="max-w-3xl mx-auto px-4 pb-12">
        <div className="relative w-full h-64 rounded-lg overflow-hidden">
          <APIProvider apiKey={apiKey}>
            <Map
              style={{ width: "100%", height: "100%" }}
              defaultCenter={mapCenter}
              defaultZoom={12}
              gestureHandling="cooperative"
              zoomControl={true}
              fullscreenControl={true}
              streetViewControl={false}
              mapTypeControl={false}
            >
              <Marker
                position={CHURCH_COORDS}
                title="Τελετή"
                onClick={() =>
                  setActivePin(activePin === "teleti" ? null : "teleti")
                }
              />

              {!isLimited && (
                <Marker
                  position={RESTAURANT_COORDS}
                  title="Δεξίωση"
                  onClick={() =>
                    setActivePin(activePin === "dexiosi" ? null : "dexiosi")
                  }
                />
              )}

              {activePin && (
                <InfoWindow
                  position={
                    activePin === "teleti" ? CHURCH_COORDS : RESTAURANT_COORDS
                  }
                  onCloseClick={() => setActivePin(null)}
                >
                  <div className="text-sm text-center p-1">
                    <p className="font-medium text-primary mb-1">
                      {activePin === "teleti" ? "Τελετή" : "Δεξίωση"}
                    </p>
                    <a
                      href={`https://www.google.com/maps?q=${
                        activePin === "teleti"
                          ? `${CHURCH_COORDS.lat},${CHURCH_COORDS.lng}`
                          : `${RESTAURANT_COORDS.lat},${RESTAURANT_COORDS.lng}`
                      }`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-link underline"
                    >
                      Άνοιγμα στον χάρτη
                    </a>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        </div>
      </div>

      {/* Gift registry */}
      <section
        id="lista"
        className="max-w-md mx-auto px-4 py-12 text-center border-t border-gray-300"
      >
        <h2 className="text-2xl text-primary mb-3">Προαιρετική Λίστα Γάμου</h2>
        <p className="text-m font-medium mt-3">IBAN: {IBAN}</p>
      </section>

      {/* Contact */}
      <section
        id="epikoinonia"
        className="max-w-2xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 gap-6 text-center border-t border-gray-300"
      >
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-primary font-medium">Χρήστος</p>
          <p className="text-xs text-gray-500 mt-1">τηλ. {hisPhone}</p>
          <div className="flex justify-center gap-3 mt-3">
            <a
              href={hisInsta}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:opacity-70"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href={hisFb}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:opacity-70"
            >
              <FaFacebook size={18} />
            </a>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-primary font-medium">Σαμψούλα</p>
          <p className="text-xs text-gray-500 mt-1">τηλ. {herPhone}</p>
          <div className="flex justify-center gap-3 mt-3">
            <a
              href={herInsta}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:opacity-70"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href={herFb}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:opacity-70"
            >
              <FaFacebook size={18} />
            </a>
          </div>
        </div>
      </section>

      <footer className="text-center text-xs text-gray-400 pb-10">
        Με αγάπη, Χρήστος &amp; Σαμψούλα
      </footer>
    </div>
  );
}

export default Invitation;
