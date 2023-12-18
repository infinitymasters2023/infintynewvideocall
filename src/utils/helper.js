export const trimSnackBarText = (text = "") => {
  const maxLength = 52;

  return text.length > maxLength ? `${text.substr(0, maxLength - 5)}...` : text;
};

export const nameTructed = (name, tructedLength) => {
  if (name?.length > tructedLength) {
    if (tructedLength === 15) {
      return `${name.substr(0, 12)}...`;
    } else {
      return `${name.substr(0, tructedLength)}...`;
    }
  } else {
    return name;
  }
};

export const json_verify = (s) => {
  try {
    JSON.parse(s);
    return true;
  } catch (e) {
    return false;
  }
};

export function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

export const allowOnlyMobileNumber = (originalValue) => {
  var transformValue = originalValue.replace(/d{10}/g, '')
  transformValue = transformValue.replace(/\D/g, '')
  transformValue = transformValue.replace(/\s/g, "");
  return transformValue
}

export const allowOnlyEmailAddresses = (originalValue) => {
  var transformValue = originalValue.toLowerCase();
  transformValue = transformValue.replace(/[^A-Za-z0-9\-_.@]/g, '')
  transformValue = transformValue.replace(/\s/g, "");
  return transformValue
}
