import { useState, useEffect } from "react";

const RandomFlag = () => {
  const countryCodes = [
    "us",
    "ca",
    "gb",
    "fr",
    "de",
    "it",
    "es",
    "jp",
    "cn",
    "ru",
  ];

  const [countryCode, setCountryCode] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * countryCodes.length);
    setCountryCode(countryCodes[randomIndex]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Construct the flag URL using the selected country code
  const flagUrl = `https://flagicons.lipis.dev/flags/4x3/${countryCode}.svg`;

  return (
    <>
      {countryCode && (
        <img height={30} style={{ verticalAlign: "middle" }} src={flagUrl} />
      )}
    </>
  );
};

export default RandomFlag;
