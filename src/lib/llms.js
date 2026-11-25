import { siteConfig } from "@/config/site";
import en from "../../messages/en.json";
import ar from "../../messages/ar.json";

function profileLinks() {
  const links = [];

  for (let i = 0; i < siteConfig.socials.length; i++) {
    links.push({
      name: siteConfig.socials[i].name,
      href: siteConfig.socials[i].href,
    });
  }

  for (let i = 0; i < siteConfig.profiles.length; i++) {
    links.push({
      name: siteConfig.profiles[i].name,
      href: siteConfig.profiles[i].href,
    });
  }

  return links;
}

function contactLines() {
  const lines = [
    "- Email: " + siteConfig.email,
    "- Phone: " + siteConfig.phone,
    "- WhatsApp: https://wa.me/" + siteConfig.whatsapp,
  ];
  const links = profileLinks();

  for (let i = 0; i < links.length; i++) {
    lines.push("- " + links[i].name + ": " + links[i].href);
  }

  lines.push("- Location: Egypt (remote work worldwide)");
  return lines;
}

function projectStatus(project) {
  return project.badge + ", " + project.year;
}

function header() {
  return [
    "# Berox",
    "",
    "> " + en.Metadata.description,
    "",
    "Berox is a software agency based in Egypt. It works remotely in English and Arabic with businesses in Egypt, the Gulf and worldwide. Projects start with a free intro call and a written proposal with scope, milestones and one total price. Source code, designs and accounts are transferred to the client after final payment.",
    "",
  ];
}

export function buildLlmsTxt() {
  const base = siteConfig.url;
  const lines = header();

  lines.push("## Key pages");
  lines.push("");
  lines.push(
    "- [Home (English)](" +
      base +
      "/en): Overview of Berox services, process and FAQ",
  );
  lines.push(
    "- [Home (Arabic)](" + base + "/ar): Arabic version of the home page",
  );
  lines.push(
    "- [Our work](" + base + "/en/work): Case studies and demo projects",
  );
  lines.push(
    "- [Contact](" + base + "/en/contact): Send a message or book a free call",
  );
  lines.push(
    "- [Privacy policy](" +
      base +
      "/en/privacy): How the website handles personal information",
  );
  lines.push("");

  lines.push("## Services");
  lines.push("");
  for (let i = 0; i < en.Services.items.length; i++) {
    const item = en.Services.items[i];
    lines.push(
      "- [" + item.title + "](" + base + "/en#services): " + item.text,
    );
  }
  lines.push("");

  lines.push("## Case studies");
  lines.push("");
  for (let i = 0; i < en.Work.projects.length; i++) {
    const project = en.Work.projects[i];
    lines.push(
      "- [" +
        project.name +
        "](" +
        base +
        "/en/work/" +
        project.slug +
        "): " +
        project.summary +
        " (" +
        projectStatus(project) +
        ")",
    );
  }
  lines.push("");

  lines.push("## Contact");
  lines.push("");
  const contacts = contactLines();
  for (let i = 0; i < contacts.length; i++) {
    lines.push(contacts[i]);
  }
  lines.push("");

  lines.push("## Optional");
  lines.push("");
  lines.push(
    "- [Full content for AI assistants](" +
      base +
      "/llms-full.txt): Services, case studies and all FAQ answers in English and Arabic",
  );
  lines.push(
    "- [Sitemap](" + base + "/sitemap.xml): All pages in both languages",
  );
  lines.push("");

  return lines.join("\n");
}

function faqLines(messages, heading) {
  const lines = ["## " + heading, ""];

  for (let t = 0; t < messages.Faq.tabs.length; t++) {
    const tab = messages.Faq.tabs[t];
    lines.push("### " + tab.label);
    lines.push("");
    for (let i = 0; i < tab.items.length; i++) {
      lines.push("**" + tab.items[i].q + "**");
      lines.push("");
      lines.push(tab.items[i].a);
      lines.push("");
    }
  }

  return lines;
}

export function buildLlmsFullTxt() {
  const base = siteConfig.url;
  const lines = header();

  lines.push("## Services");
  lines.push("");
  for (let i = 0; i < en.Services.items.length; i++) {
    const item = en.Services.items[i];
    lines.push("### " + item.title);
    lines.push("");
    lines.push(item.text);
    lines.push("");
    for (let p = 0; p < item.points.length; p++) {
      lines.push("- " + item.points[p]);
    }
    lines.push("");
  }

  lines.push("## How a project works");
  lines.push("");
  lines.push(en.Process.text);
  lines.push("");
  for (let i = 0; i < en.Process.items.length; i++) {
    const step = en.Process.items[i];
    lines.push(i + 1 + ". **" + step.title + "**: " + step.text);
  }
  lines.push("");

  lines.push("## Case studies");
  lines.push("");
  for (let i = 0; i < en.Work.projects.length; i++) {
    const project = en.Work.projects[i];
    lines.push("### " + project.name);
    lines.push("");
    lines.push("Page: " + base + "/en/work/" + project.slug);
    lines.push("");
    lines.push(
      "Status: " +
        projectStatus(project) +
        ". Category: " +
        project.category +
        ". Services: " +
        project.services +
        ". Timeline: " +
        project.timeline +
        ".",
    );
    lines.push("");
    lines.push(project.overview);
    lines.push("");
    lines.push("Challenge: " + project.challenge);
    lines.push("");
    lines.push("Approach: " + project.solution);
    lines.push("");
    lines.push("Built with: " + project.tags.join(", ") + ".");
    lines.push("");
  }

  const faqEn = faqLines(en, "Frequently asked questions (English)");
  for (let i = 0; i < faqEn.length; i++) {
    lines.push(faqEn[i]);
  }

  lines.push("## Services in Arabic");
  lines.push("");
  for (let i = 0; i < ar.Services.items.length; i++) {
    lines.push(
      "- " + ar.Services.items[i].title + ": " + ar.Services.items[i].text,
    );
  }
  lines.push("");

  const faqAr = faqLines(ar, "الأسئلة الشائعة (Arabic FAQ)");
  for (let i = 0; i < faqAr.length; i++) {
    lines.push(faqAr[i]);
  }

  lines.push("## Contact");
  lines.push("");
  const contacts = contactLines();
  for (let i = 0; i < contacts.length; i++) {
    lines.push(contacts[i]);
  }
  lines.push("");

  return lines.join("\n");
}
