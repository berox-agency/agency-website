function optionLabel(field, value) {
  if (!field.options) {
    return value;
  }

  for (let i = 0; i < field.options.length; i++) {
    if (field.options[i].id === value) {
      return field.options[i].label;
    }
  }

  return value;
}

export function buildEntries(fields, values) {
  const entries = [];

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const raw = String(values[field.name] || "").trim();

    if (raw === "") {
      continue;
    }

    entries.push({
      name: field.name,
      label: field.label,
      value: optionLabel(field, raw),
    });
  }

  return entries;
}

export function buildContactText(intro, entries) {
  const lines = [intro, ""];

  for (let i = 0; i < entries.length; i++) {
    lines.push(entries[i].label + ": " + entries[i].value);
  }

  return lines.join("\n");
}

function labelFor(entry, messages) {
  if (messages.labels && messages.labels[entry.name]) {
    return messages.labels[entry.name];
  }

  return entry.label;
}

export function buildWhatsAppText(payload, messages) {
  const mode = messages.modes ? messages.modes[payload.mode] : null;

  if (!mode) {
    return payload.text;
  }

  const lines = [];
  let fullName = "";

  lines.push("*" + mode.title + "*");
  lines.push("");
  lines.push(messages.greeting);
  lines.push("");
  lines.push(mode.lead);
  lines.push("");

  for (let i = 0; i < payload.entries.length; i++) {
    const entry = payload.entries[i];
    const label = labelFor(entry, messages);

    if (entry.name === "fullName") {
      fullName = entry.value;
    }

    if (
      entry.value.indexOf("\n") !== -1 ||
      label.length + entry.value.length > 70
    ) {
      lines.push("");
      lines.push("*" + label + ":*");
      lines.push(entry.value);
      lines.push("");
    } else {
      lines.push("*" + label + ":* " + entry.value);
    }
  }

  lines.push("");
  lines.push(messages.closing);
  lines.push("");
  lines.push(messages.regards);

  if (fullName !== "") {
    lines.push(fullName);
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n");
}

export async function sendContact(delivery, payload) {
  if (delivery.type === "api") {
    const response = await fetch(delivery.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    return;
  }

  if (delivery.type === "email") {
    window.location.href =
      "mailto:" +
      delivery.to +
      "?subject=" +
      encodeURIComponent(payload.subject) +
      "&body=" +
      encodeURIComponent(payload.text);
    return;
  }

  const text = delivery.messages
    ? buildWhatsAppText(payload, delivery.messages)
    : payload.text;
  const url =
    "https://wa.me/" + delivery.number + "?text=" + encodeURIComponent(text);
  const opened = window.open(url, "_blank");

  if (opened) {
    opened.opener = null;
  } else {
    window.location.href = url;
  }
}
