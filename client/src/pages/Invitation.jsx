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

function Invitation() {
  const [searchParams] = useSearchParams();
  const isLimited = searchParams.get("v") === "1"; // church-only variant

  const { addGuest, loading, error } = useGuestContext();
  const [form, setForm] = useState({
    name: "",
    surname: "",
    isAttending: true,
    personsCount: 1,
  });
  const [submitted, setSubmitted] = useState(false);
  const [activePin, setActivePin] = useState(null);

  const apiKey = import.meta.env.VITE_GOOGLE_API;
  // coordinates for the locations
  const CHURCH_COORDS = { lat: 37.9755, lng: 23.7348 };
  const RESTAURANT_COORDS = { lat: 37.9838, lng: 23.7275 };

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      surname: form.surname,
      isAttending: form.isAttending,
      personsCount: form.isAttending ? Number(form.personsCount) || 1 : 0,
    };
    const result = await addGuest(payload);
    if (result) setSubmitted(true);
  };

  return (
    <div className="bg-pearl-bush min-h-screen text-gray-700">
      {/* Hero */}
      <header className="text-center pt-16 pb-10 px-4">
        {/* placeholder for floral graphic image, to be replaced later */}
        <div className="h-20 flex items-center justify-center text-gray-400 text-sm mb-4">
          [ maybe an animation ]
        </div>
        <h1 className="text-4xl sm:text-5xl text-teal-green-dark mb-2">
          Χρήστος &amp; Σαμσούλα
        </h1>
        <p className="text-sm tracking-widest text-gray-500">
          ΣΑΒΒΑΤΟ 5 ΔΕΚΕΜΒΡΙΟΥ 2026 | 12:00
        </p>
      </header>

      {/* Nav */}
      <nav className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm tracking-wide text-teal-green-dark border-t border-b border-gray-300 py-3 px-4">
        <a href="#rsvp" className="hover:opacity-70">
          RSVP
        </a>
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

      {/* Our Story */}
      {/* <section className="max-w-2xl mx-auto text-center px-4 py-12">
        <h2 className="text-2xl text-teal-green-dark mb-4">Η ιστορία μας</h2>
        <p className="text-sm leading-relaxed text-gray-600">
          Εδώ θα μπει το κείμενο με την ιστορία του ζευγαριού. Λίγα λόγια για το
          πώς γνωριστήκαμε, τη διαδρομή μας μέχρι σήμερα, και τη χαρά που
          νιώθουμε που θα μοιραστούμε αυτή τη μέρα μαζί σας.
        </p>
      </section> */}

      {/* Photo placeholder */}
      {/* <div className="max-w-3xl mx-auto px-4">
        <div className="w-full aspect-video bg-gray-200 flex items-center justify-center text-gray-400 text-sm rounded-lg">
          [ Fotografia zeugariou ]
        </div>
      </div> */}

      {/* RSVP Form */}
      <section id="rsvp" className="max-w-md mx-auto px-4 py-16">
        <h2 className="text-2xl text-teal-green-dark text-center mb-2">
          Ο γάμος μας
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          Θα χαρούμε πολύ αν μας ενημερώσετε για την παρουσία σας έως τις 15
          Νοεμβρίου 2026
        </p>

        {submitted ? (
          <div className="text-center bg-white rounded-xl p-6 border border-gray-200">
            <Check size={32} className="mx-auto mb-2 text-teal-green" />
            <p className="text-teal-green-dark font-medium">
              Ευχαριστούμε για την απάντησή σας!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  Όνομα *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full border-b border-gray-400 bg-transparent py-1 outline-none focus:border-teal-green"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  Επώνυμο *
                </label>
                <input
                  type="text"
                  required
                  value={form.surname}
                  onChange={(e) => handleChange("surname", e.target.value)}
                  className="w-full border-b border-gray-400 bg-transparent py-1 outline-none focus:border-teal-green"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-2">
                Θα παρευρεθείτε; *
              </label>
              <div className="flex gap-6 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="attending"
                    checked={form.isAttending === true}
                    onChange={() => handleChange("isAttending", true)}
                    className="accent-teal-green"
                  />
                  Ναι
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="attending"
                    checked={form.isAttending === false}
                    onChange={() => handleChange("isAttending", false)}
                    className="accent-teal-green"
                  />
                  Όχι
                </label>
              </div>
            </div>

            {form.isAttending && (
              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  Αριθμός ατόμων *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={form.personsCount}
                  onChange={(e) => handleChange("personsCount", e.target.value)}
                  className="w-full border-b border-gray-400 bg-transparent py-1 outline-none focus:border-teal-green"
                />
              </div>
            )}

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-green-dark text-white rounded-full py-3 mt-4 flex items-center justify-center gap-2 disabled:opacity-60 hover:opacity-90 transition-opacity"
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

      {/* Venues */}
      <section
        id="teleti"
        className={`max-w-3xl mx-auto px-4 py-12 grid gap-8 text-center ${
          isLimited
            ? "grid-cols-1 justify-items-center"
            : "sm:grid-cols-2 grid-cols-1"
        }`}
      >
        <div>
          <h3 className="text-xl text-teal-green-dark mb-2">Τελετή</h3>
          <p className="text-sm font-medium">Ιερός Ναός Αγίου Παντελεήμονα</p>
          <p className="text-xs text-gray-500">
            Αλεξανδρουπόλεως, Αργυρούπολη, 164 51 Αθηνα
          </p>
        </div>
        {!isLimited && (
          <div id="dexiosi">
            <h3 className="text-xl text-teal-green-dark mb-2">Δεξίωση</h3>
            <p className="text-sm font-medium">Venus Hall</p>
            <p className="text-xs text-gray-500">
              Ανδρέου Παπανδρέου, Γλυφάδα 1, 165 38 Αθήνα
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
              defaultCenter={CHURCH_COORDS}
              defaultZoom={13}
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
                    <p className="font-medium text-teal-green-dark mb-1">
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
                      className="text-xs text-blue underline"
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
        <h2 className="text-2xl text-teal-green-dark mb-3">Λίστα γάμου</h2>
        <p className="text-sm text-gray-600">
          Χαιρόμαστε πολύ για την αγάπη σας. Αν επιθυμείτε, μπορείτε να μας
          στηρίξετε στο νέο μας ξεκίνημα:
        </p>
        <p className="text-sm font-medium mt-3">
          IBAN: GR78 0000 0000 0000 0000 0000 000
        </p>
      </section>

      {/* Contact */}
      <section
        id="epikoinonia"
        className="max-w-2xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 gap-6 text-center"
      >
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          {/* <div className="w-24 h-24 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs">
            [ foto ]
          </div> */}
          <p className="text-teal-green-dark font-medium">Χρήστος</p>
          <p className="text-xs text-gray-500 mt-1">τηλ. 697 1234567</p>
          {/* facebook and instagram  */}
          <div className="flex justify-center gap-3 mt-3">
            <a
              href="https://www.instagram.com/chris.andriopoulos/"
              target="_blank"
              rel="noreferrer"
              className="text-teal-green-dark hover:opacity-70"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href="https://www.facebook.com/xristos.an"
              target="_blank"
              rel="noreferrer"
              className="text-teal-green-dark hover:opacity-70"
            >
              <FaFacebook size={18} />
            </a>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          {/* <div className="w-24 h-24 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs">
            [ foto ]
          </div> */}
          <p className="text-teal-green-dark font-medium">Σαμσούλα</p>
          <p className="text-xs text-gray-500 mt-1">τηλ. 698 7654321</p>
          {/* facebook and instagram */}
          <div className="flex justify-center gap-3 mt-3">
            <a
              href="https://www.instagram.com/chris.andriopoulos"
              target="_blank"
              rel="noreferrer"
              className="text-teal-green-dark hover:opacity-70"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href="https://www.facebook.com/xristos.an"
              target="_blank"
              rel="noreferrer"
              className="text-teal-green-dark hover:opacity-70"
            >
              <FaFacebook size={18} />
            </a>
          </div>
        </div>
      </section>

      <footer className="text-center text-xs text-gray-400 pb-10">
        Με αγάπη, Χρήστος &amp; Σαμσούλα
      </footer>
    </div>
  );
}

export default Invitation;
