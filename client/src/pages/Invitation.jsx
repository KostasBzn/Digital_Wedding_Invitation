import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, Check } from "lucide-react";
import {
  APIProvider,
  Map as GoogleMap,
  Marker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { useGuestContext } from "../context/GuestContext";
import useReveal from "../hooks/useReveal";
import HeartDivider from "../components/HeartDivider";
import Decor from "../components/Decor";

import church from "../assets/church.jpg";
import sprigLaurel from "../assets/eucalyptus_sprig_laurel.png";

// environment variables
const apiKey = import.meta.env.VITE_GOOGLE_API;
const IBAN = import.meta.env.VITE_IBAN;

const CONTACTS = [
  {
    name: "Χρήστος",
    phone: import.meta.env.VITE_HIS_PHONE,
    instagram: import.meta.env.VITE_HIS_INSTA,
    facebook: import.meta.env.VITE_HIS_FB,
  },
  {
    name: "Σαμψούλα",
    phone: import.meta.env.VITE_HER_PHONE,
    instagram: import.meta.env.VITE_HER_INSTA,
    facebook: import.meta.env.VITE_HER_FB,
  },
];

// keys match the section ids
const LOCATIONS = {
  teleti: {
    label: "Τελετή",
    coords: { lat: 37.816697, lng: 23.778526 },
  },
  dexiosi: {
    label: "Δεξίωση",
    coords: { lat: 37.853046, lng: 23.813512 },
  },
};

const NAV_LINKS = [
  { href: "#rsvp", label: "RSVP", fullOnly: true },
  { href: "#teleti", label: "ΤΕΛΕΤΗ" },
  { href: "#dexiosi", label: "ΔΕΞΙΩΣΗ", fullOnly: true },
  { href: "#lista", label: "ΛΙΣΤΑ ΓΑΜΟΥ" },
  { href: "#epikoinonia", label: "ΕΠΙΚΟΙΝΩΝΙΑ" },
];

const ATTENDING_OPTIONS = [
  { label: "Ναι", value: true },
  { label: "Όχι", value: false },
];

const SUBMIT_ERROR =
  "Κάτι πήγε στραβά. Παρακαλούμε δοκιμάστε ξανά ή επικοινωνήστε μαζί μας.";

// Force black and white map
const MAP_STYLES = [
  { stylers: [{ saturation: -100 }, { gamma: 0.9 }] },
  { featureType: "poi.business", stylers: [{ visibility: "off" }] },
];

const CORNER_SIZE = "w-[42vw] max-w-[420px] sm:w-[58vw] sm:max-w-[520px]";

const labelCls = "block text-xs tracking-[0.15em] text-ink-soft";
const inputCls =
  "w-full border-b border-ink/40 bg-transparent py-1.5 text-base outline-none transition-colors focus:border-ink";
const eyebrow = "text-xs tracking-invite sm:text-sm";
const heading = "text-lg tracking-invite sm:text-2xl";
const familyNames = "text-base leading-relaxed tracking-[0.1em] sm:text-xl";

const revealDelay = (ms) => ({ "--reveal-delay": `${ms}ms` });

function Field({ id, label, type = "text", ...props }) {
  return (
    <div>
      <label htmlFor={id} className={`mb-1 ${labelCls}`}>
        {label}
      </label>
      <input id={id} type={type} className={inputCls} {...props} />
    </div>
  );
}

function VenueInfo({ title, name, address }) {
  return (
    <>
      <h2 className={`reveal ${heading}`}>{title}</h2>
      <HeartDivider className="reveal mt-5" />
      <p
        style={revealDelay(150)}
        className="reveal mt-8 text-xl italic sm:text-2xl"
      >
        {name}
      </p>
      <p
        style={revealDelay(250)}
        className="reveal mt-2 text-base italic text-ink-soft sm:text-lg"
      >
        {address}
      </p>
    </>
  );
}

function ContactCard({ name, phone, instagram, facebook, delay }) {
  return (
    <div
      style={revealDelay(delay)}
      className="reveal rounded-2xl border border-line bg-card p-6"
    >
      <p className="text-lg tracking-[0.12em]">{name}</p>
      <p className="mt-1 text-base italic text-ink-soft">τηλ. {phone}</p>
      <div className="mt-3 flex justify-center gap-4">
        <a
          href={instagram}
          target="_blank"
          rel="noreferrer"
          className="hover:opacity-60"
        >
          <FaInstagram size={20} />
        </a>
        <a
          href={facebook}
          target="_blank"
          rel="noreferrer"
          className="hover:opacity-60"
        >
          <FaFacebook size={20} />
        </a>
      </div>
    </div>
  );
}

function Invitation() {
  const [searchParams] = useSearchParams();
  const isLimited = searchParams.get("v") === "1"; // church-only version

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

  useReveal();

  const { teleti, dexiosi } = LOCATIONS;
  const pinIds = isLimited ? ["teleti"] : Object.keys(LOCATIONS);
  const activeLocation = LOCATIONS[activePin];

  // center between the two pins (or on the church only)
  const mapCenter = isLimited
    ? teleti.coords
    : {
        lat: (teleti.coords.lat + dexiosi.coords.lat) / 2,
        lng: (teleti.coords.lng + dexiosi.coords.lng) / 2,
      };

  const navLinks = NAV_LINKS.filter((link) => !isLimited || !link.fullOnly);

  const togglePin = (pin) => setActivePin((cur) => (cur === pin ? null : pin));

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await addGuest({
      name: form.name.trim(),
      surname: form.surname.trim(),
      isAttending: form.isAttending,
      adultsCount: form.isAttending ? Number(form.adultsCount) : 0,
      kidsCount: form.isAttending ? Number(form.kidsCount) : 0,
    });
    if (result) setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-page-bg font-serif text-ink">
      {/* Hero */}
      <header className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-24 text-center sm:pt-40">
        <Decor at="tl" className={CORNER_SIZE} />
        <Decor at="br" className={CORNER_SIZE} delay={200} />

        <div className="relative z-10 flex flex-col items-center">
          <p
            style={revealDelay(200)}
            className="reveal max-w-xs text-[11px] leading-relaxed tracking-invite sm:max-w-none sm:text-sm"
          >
            ΜΕ ΧΑΡΑ ΣΑΣ ΠΡΟΣΚΑΛΟΥΜΕ ΣΤΟ ΓΑΜΟ ΜΑΣ
          </p>

          <h1
            style={revealDelay(400)}
            className="reveal mt-8 text-4xl leading-tight tracking-[0.12em] sm:text-6xl"
          >
            ΧΡΗΣΤΟΣ
            <span className="my-1 block text-3xl italic tracking-normal sm:text-5xl">
              &amp;
            </span>
            ΣΑΜΨΟΥΛΑ
          </h1>

          <div style={revealDelay(600)} className="reveal mt-10">
            <HeartDivider />
          </div>

          <div style={revealDelay(800)} className="reveal mt-10">
            <p className={eyebrow}>ΣΑΒΒΑΤΟ</p>
            <p className="mt-2 text-3xl tracking-[0.18em] sm:text-5xl">
              05.12.2026
            </p>
            <p className={`mt-5 ${eyebrow}`}>ΩΡΑ</p>
            <p className="mt-1 text-2xl tracking-[0.18em] sm:text-4xl">18:30</p>
          </div>
        </div>
      </header>

      {/* Families */}
      <section className="px-6 py-20 text-center sm:py-28">
        <div className="mx-auto max-w-xl">
          <div style={revealDelay(150)} className="reveal">
            <p className={eyebrow}>ΟΙΚΟΓΕΝΕΙΕΣ</p>
            <p className={`mt-4 ${familyNames}`}>
              ΚΩΝΣΤΑΝΤΙΝΟΣ ΒΑΣΙΛΕΙΑΔΗΣ &amp; ΕΥΑΓΓΕΛΙΑ ΔΑΝΕΖΗ
            </p>
            <p className={`mt-2 ${familyNames}`}>
              ΘΕΟΔΩΡΟΣ ΑΝΔΡΙΟΠΟΥΛΟΣ &amp; ΣΤΑΜΑΤΙΑ ΛΑΜΠΡΟΠΟΥΛΟΥ
            </p>
          </div>

          <HeartDivider className="reveal my-10" />

          <div style={revealDelay(150)} className="reveal">
            <p className={eyebrow}>ΚΟΥΜΠΑΡΕΣ</p>
            <p className={`mt-4 ${familyNames}`}>
              ΑΝΝΑ ΦΑΡΜΑΚΗ &amp; ΑΣΗΜΙΝΑ ΑΝΔΡΙΟΠΟΥΛΟΥ
            </p>
          </div>
        </div>
      </section>

      {/* Nav */}
      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 border-y border-ink/15 px-4 py-4 text-[11px] tracking-invite sm:gap-x-10 sm:text-xs">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} className="hover:opacity-60">
            {link.label}
          </a>
        ))}
      </nav>

      {/* RSVP */}
      {!isLimited && (
        <section
          id="rsvp"
          className="relative overflow-hidden px-6 pt-40 pb-20 sm:pt-52 sm:pb-28"
        >
          <Decor at="tr" className="w-[50vw] max-w-[360px] sm:max-w-[440px]" />
          <div className="relative z-10 mx-auto max-w-md">
            <h2 className={`reveal text-center ${heading}`}>Ο ΓΑΜΟΣ ΜΑΣ</h2>
            <HeartDivider className="reveal mt-5" />
            <p
              style={revealDelay(150)}
              className="reveal mt-6 mb-10 text-center text-base italic leading-relaxed text-ink-soft sm:text-lg"
            >
              Θα χαρούμε πολύ να μας ενημερώσετε για την παρουσία σας έως τις 15
              Νοεμβρίου 2026
            </p>

            {submitted ? (
              <div className="rounded-2xl border border-line bg-card p-5 text-center sm:p-6">
                <Check size={28} className="mx-auto mb-2 sm:h-8 sm:w-8" />
                <p className="text-sm font-medium sm:text-base">
                  Ευχαριστούμε για την απάντησή σας!
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={revealDelay(250)}
                className="reveal space-y-5"
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    id="guest-name"
                    label="Όνομα *"
                    required
                    autoComplete="given-name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                  <Field
                    id="guest-surname"
                    label="Επώνυμο *"
                    required
                    autoComplete="family-name"
                    value={form.surname}
                    onChange={(e) => handleChange("surname", e.target.value)}
                  />
                </div>

                <fieldset>
                  <legend className={`mb-3 ${labelCls}`}>
                    Θα παρευρεθείτε; *
                  </legend>
                  <div className="flex gap-4 text-sm sm:gap-6">
                    {ATTENDING_OPTIONS.map(({ label, value }) => (
                      <label
                        key={label}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <input
                          type="radio"
                          name="attending"
                          checked={form.isAttending === value}
                          onChange={() => handleChange("isAttending", value)}
                          className="accent-ink"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {form.isAttending && (
                  <div className="grid grid-cols-2 gap-5">
                    <Field
                      id="guest-adults"
                      label="Ενήλικες *"
                      type="number"
                      min="1"
                      required
                      value={form.adultsCount}
                      onChange={(e) =>
                        handleChange("adultsCount", e.target.value)
                      }
                    />
                    <Field
                      id="guest-kids"
                      label="Παιδιά"
                      type="number"
                      min="0"
                      value={form.kidsCount}
                      onChange={(e) =>
                        handleChange("kidsCount", e.target.value)
                      }
                    />
                  </div>
                )}

                {error && (
                  <p className="text-center text-sm text-red-700">
                    {SUBMIT_ERROR}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm tracking-invite text-page-bg transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    "ΥΠΟΒΟΛΗ"
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      )}

      {/* Ceremony */}
      <section
        id="teleti"
        className="overflow-hidden pt-20 text-center sm:pt-28"
      >
        <div className="px-6">
          <VenueInfo
            title="ΤΕΛΕΤΗ"
            name="Ιερός Ναός Παναγίας Φανερωμένης"
            address="Αιόλου 8, Βουλιαγμένη 166 71, Αθήνα"
          />
        </div>

        <div className="reveal reveal-scale photo-fade-y relative mt-12 mb-16 h-[420px] overflow-hidden sm:mb-24 sm:h-[540px] lg:h-[1060px]">
          <img
            src={church}
            alt="Ιερός Ναός Παναγίας Φανερωμένης"
            className="parallax photo-bw absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </section>

      {/* Reception */}
      {!isLimited && (
        <section id="dexiosi" className="px-6 pb-16 text-center sm:pb-24">
          <VenueInfo
            title="ΔΕΞΙΩΣΗ"
            name="Κτήμα Ιβέλια"
            address="Λαμπτρών, Κορωπί 166 72, Ελλάδα"
          />
        </section>
      )}

      {/* Map */}
      <div className="mx-auto max-w-3xl px-4 pb-20">
        <div className="reveal relative h-72 w-full overflow-hidden rounded-2xl border border-ink/15 sm:h-96">
          <APIProvider apiKey={apiKey}>
            <GoogleMap
              style={{ width: "100%", height: "100%" }}
              defaultCenter={mapCenter}
              defaultZoom={isLimited ? 15 : 12}
              styles={MAP_STYLES}
              gestureHandling="cooperative"
              zoomControl={true}
              fullscreenControl={true}
              streetViewControl={false}
              mapTypeControl={false}
            >
              {pinIds.map((id) => (
                <Marker
                  key={id}
                  position={LOCATIONS[id].coords}
                  title={LOCATIONS[id].label}
                  onClick={() => togglePin(id)}
                />
              ))}

              {activeLocation && (
                <InfoWindow
                  position={activeLocation.coords}
                  onCloseClick={() => setActivePin(null)}
                >
                  <div className="p-1 text-center text-sm text-ink">
                    <p className="mb-1 font-medium">{activeLocation.label}</p>
                    <a
                      href={`https://www.google.com/maps?q=${activeLocation.coords.lat},${activeLocation.coords.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs underline"
                    >
                      Άνοιγμα στον χάρτη
                    </a>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </APIProvider>
        </div>
      </div>

      {/* Gift registry */}
      <section id="lista" className="mx-auto max-w-md px-6 py-16 text-center">
        <div className="reveal flex justify-center">
          <img
            src={sprigLaurel}
            alt=""
            className="mb-8 h-auto w-64 sm:w-80"
            draggable="false"
          />
        </div>
        <h2 className={`reveal ${heading}`}>ΠΡΟΑΙΡΕΤΙΚΗ ΛΙΣΤΑ ΓΑΜΟΥ</h2>
        <HeartDivider className="reveal mt-5" />
        <p
          style={revealDelay(150)}
          className="reveal mt-8 break-all text-base tracking-wide sm:text-lg"
        >
          IBAN: {IBAN}
        </p>
      </section>

      {/* Contact */}
      <section
        id="epikoinonia"
        className="mx-auto max-w-2xl px-6 pt-10 pb-16 text-center"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {CONTACTS.map((contact, i) => (
            <ContactCard
              key={contact.name}
              {...contact}
              delay={100 + i * 150}
            />
          ))}
        </div>
      </section>

      <footer className="relative overflow-hidden px-6 pt-24 pb-[44vw] text-center sm:pb-20">
        <Decor at="bl" className={CORNER_SIZE} />
        <p className="reveal relative z-10 text-xl italic text-ink-soft sm:text-2xl">
          Με αγάπη, Χρήστος &amp; Σαμψούλα
        </p>
      </footer>
    </div>
  );
}

export default Invitation;
