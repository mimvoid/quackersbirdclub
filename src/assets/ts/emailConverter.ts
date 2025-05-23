/**
 * This is a simple email obfuscation script.
 *
 * Although some web crawlers can be advanced, this should thwart a good
 * amount of them.
 *
 * This script finds HTML elements with the attribute `data-email`.
 * It then adds the corresponding "mailto:" link and replace the text with the
 * email address according to the value in `data-email`.
 */

interface Email {
  name: string;
  domain: string;
  dataValue: string;
}

const emails: Email[] = [
  {
    name: "quackersbirdclub",
    domain: "@gmail.com",
    dataValue: "club",
  },
];

for (const email of emails) {
  const emailNodes = document.querySelectorAll(
    `[data-email="${email.dataValue}\"]`,
  );

  for (const node of emailNodes) {
    node.setAttribute("href", "mailto:" + email.name + email.domain);
    node.textContent = email.name + email.domain;
  }
}
