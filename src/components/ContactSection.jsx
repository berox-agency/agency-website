"use client";

import { useEffect, useId, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";
import { buildContactText, buildEntries, sendContact } from "@/lib/contact";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9\u0660-\u0669+\-\s().]+$/;

const INPUT =
  "w-full rounded-2xl border bg-canvas px-4 text-base text-content outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-muted/60 focus:border-primary focus:shadow-[0_0_0_3px_rgb(var(--primary-rgb)/0.2)] ";

const CHIP =
  "flex h-11 cursor-pointer items-center rounded-full border border-line bg-canvas px-4 text-sm font-medium text-muted transition-colors duration-300 hover:border-primary/50 hover:text-content peer-checked:border-primary peer-checked:bg-primary peer-checked:text-onprimary peer-checked:hover:text-onprimary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary";

const CARD =
  "flex h-full cursor-pointer flex-col items-center gap-1.5 rounded-2xl border border-line bg-canvas px-4 py-5 text-center transition-[border-color,background-color,box-shadow] duration-300 hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:shadow-[0_0_0_1px_var(--primary)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary";

const ICONS = {
  message: (
    <>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-3.6 3.2a.6.6 0 0 1-1-.45V16h-.4A2.5 2.5 0 0 1 4 13.5z" />
      <path d="M8 9h8M8 12h5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  whatsapp: (
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  ),
  phone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  ),
  video: (
    <>
      <rect x="3" y="6" width="12" height="12" rx="3" />
      <path d="M15 10l6-3v10l-6-3z" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5M12 16h.01" />
    </>
  ),
  chevron: <path d="M6 9l6 6 6-6" />,
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
};

const FILLED = { whatsapp: true };

function Icon({ name, className = "h-5 w-5" }) {
  const filled = FILLED[name] === true;

  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {ICONS[name]}
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4 animate-spin"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function isEmpty(value) {
  return String(value).trim() === "";
}

function digitCount(value) {
  let count = 0;

  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);

    if ((code >= 48 && code <= 57) || (code >= 1632 && code <= 1641)) {
      count++;
    }
  }

  return count;
}

function initialValues(fields) {
  const values = {};

  for (let i = 0; i < fields.length; i++) {
    values[fields[i].name] = fields[i].defaultValue || "";
  }

  return values;
}

function validate(fields, values, messages) {
  const found = {};

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const value = values[field.name];
    const empty = isEmpty(value);

    if (field.required && empty) {
      found[field.name] = messages.required;
      continue;
    }

    if (empty) {
      continue;
    }

    const text = value.trim();

    if (field.type === "email" && !EMAIL_PATTERN.test(text)) {
      found[field.name] = messages.email;
    }

    if (field.type === "tel") {
      const digits = digitCount(text);

      if (!PHONE_PATTERN.test(text) || digits < 7 || digits > 15) {
        found[field.name] = messages.phone;
      }
    }
  }

  return found;
}

function focusFirstInvalid(fields, found, uid) {
  for (let i = 0; i < fields.length; i++) {
    if (found[fields[i].name]) {
      const node = document.getElementById(uid + "-" + fields[i].name);

      if (node) {
        node.focus();
      }

      return;
    }
  }
}

function LabelText({ field, optional }) {
  return (
    <>
      <span>
        {field.label}
        {field.required ? (
          <span aria-hidden="true" className="ms-1 text-primary">
            *
          </span>
        ) : null}
      </span>
      {!field.required ? (
        <span className="text-xs font-normal text-muted">{optional}</span>
      ) : null}
    </>
  );
}

function ErrorText({ id, children }) {
  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-sm text-danger">
      <Icon name="alert" className="h-4 w-4 shrink-0" />
      {children}
    </p>
  );
}

function TextField({ field, id, value, error, optional, onChange }) {
  const area = field.type === "textarea";
  const ltr = field.type === "tel" || field.type === "email";
  const common = {
    id: id,
    name: field.name,
    value: value,
    placeholder: field.placeholder,
    autoComplete: field.autoComplete,
    "aria-required": field.required ? true : undefined,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? id + "-error" : undefined,
    onChange: function (event) {
      onChange(field.name, event.target.value);
    },
    className:
      INPUT +
      (error ? "border-danger " : "border-line ") +
      (area ? "min-h-32 resize-y py-3.5" : "h-12") +
      (field.type === "time" ? " min-w-0 appearance-none text-start" : "") +
      (ltr ? " rtl:text-end" : ""),
  };

  return (
    <div className={field.span === 2 ? "md:col-span-2" : ""}>
      <label
        htmlFor={id}
        className="mb-2.5 flex items-baseline justify-between gap-3 text-sm font-medium text-content"
      >
        <LabelText field={field} optional={optional} />
      </label>
      {area ? (
        <textarea
          {...common}
          rows={field.rows || 5}
          maxLength={field.maxLength}
        />
      ) : (
        <input
          {...common}
          type={field.type}
          inputMode={field.type === "tel" ? "tel" : undefined}
          dir={ltr ? "ltr" : undefined}
        />
      )}
      {area && field.maxLength ? (
        <p aria-hidden="true" className="mt-2 text-end text-xs text-muted">
          {value.length}/{field.maxLength}
        </p>
      ) : null}
      {field.hint && !error ? (
        <p className="mt-2 text-xs text-muted">{field.hint}</p>
      ) : null}
      {error ? <ErrorText id={id + "-error"}>{error}</ErrorText> : null}
    </div>
  );
}

function SelectField({ field, id, value, error, optional, onChange }) {
  const options = [
    <option key="empty" value="">
      {field.placeholder}
    </option>,
  ];

  for (let i = 0; i < field.options.length; i++) {
    options.push(
      <option key={field.options[i].id} value={field.options[i].id}>
        {field.options[i].label}
      </option>,
    );
  }

  return (
    <div className={field.span === 2 ? "md:col-span-2" : ""}>
      <label
        htmlFor={id}
        className="mb-2.5 flex items-baseline justify-between gap-3 text-sm font-medium text-content"
      >
        <LabelText field={field} optional={optional} />
      </label>
      <div className="relative">
        <select
          id={id}
          name={field.name}
          value={value}
          aria-required={field.required ? true : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? id + "-error" : undefined}
          onChange={function (event) {
            onChange(field.name, event.target.value);
          }}
          className={
            INPUT +
            "h-12 cursor-pointer appearance-none pe-11 " +
            (error ? "border-danger " : "border-line ") +
            (value === "" ? "text-muted/80" : "")
          }
        >
          {options}
        </select>
        <Icon
          name="chevron"
          className="pointer-events-none absolute inset-e-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        />
      </div>
      {error ? <ErrorText id={id + "-error"}>{error}</ErrorText> : null}
    </div>
  );
}

function ChipsField({ field, id, name, value, error, optional, onChange }) {
  const cards = field.variant === "cards";
  const items = [];

  for (let i = 0; i < field.options.length; i++) {
    const option = field.options[i];

    items.push(
      <label key={option.id} className="relative block">
        <input
          type="radio"
          id={i === 0 ? id : undefined}
          name={name}
          value={option.id}
          checked={value === option.id}
          aria-describedby={error ? id + "-error" : undefined}
          onChange={function () {
            onChange(field.name, option.id);
          }}
          className="peer sr-only"
        />
        {cards ? (
          <span className={CARD}>
            {option.icon ? (
              <Icon name={option.icon} className="h-6 w-6 text-primary" />
            ) : null}
            <span className="text-sm font-semibold text-content">
              {option.label}
            </span>
            {option.hint ? (
              <span className="text-xs text-muted">{option.hint}</span>
            ) : null}
          </span>
        ) : (
          <span className={CHIP}>{option.label}</span>
        )}
      </label>,
    );
  }

  return (
    <fieldset
      className={field.span === 2 ? "min-w-0 md:col-span-2" : "min-w-0"}
    >
      <legend className="mb-2.5 w-full p-0 text-sm font-medium text-content">
        <span className="flex items-baseline justify-between gap-3">
          <LabelText field={field} optional={optional} />
        </span>
      </legend>
      <div
        className={
          cards ? "grid gap-3 sm:grid-cols-3" : "flex flex-wrap gap-2.5"
        }
      >
        {items}
      </div>
      {error ? <ErrorText id={id + "-error"}>{error}</ErrorText> : null}
    </fieldset>
  );
}

function FormPanel({ mode, ui, delivery }) {
  const form = mode.form;
  const fields = form.fields;
  const uid = useId();
  const trapRef = useRef(null);
  const doneRef = useRef(null);
  const [values, setValues] = useState(function () {
    return initialValues(fields);
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  useEffect(
    function () {
      if (status === "success" && doneRef.current) {
        doneRef.current.focus();
      }
    },
    [status],
  );

  function setValue(name, value) {
    setValues(function (current) {
      return { ...current, [name]: value };
    });
    setErrors(function (current) {
      if (!current[name]) {
        return current;
      }

      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function reset() {
    setValues(initialValues(fields));
    setErrors({});
    setStatus("idle");
  }

  async function onSubmit(event) {
    event.preventDefault();

    if (status === "sending") {
      return;
    }

    const found = validate(fields, values, ui.errors);

    if (Object.keys(found).length > 0) {
      setErrors(found);
      setStatus("idle");
      focusFirstInvalid(fields, found, uid);
      return;
    }

    if (trapRef.current && trapRef.current.value !== "") {
      setStatus("success");
      return;
    }

    const entries = buildEntries(fields, values);
    const payload = {
      mode: mode.id,
      subject: form.subject,
      text: buildContactText(form.intro, entries),
      values: values,
      entries: entries,
    };

    setStatus("sending");

    try {
      await sendContact(delivery, payload);
      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  }

  if (status === "success") {
    const done = ui.success[delivery.type];

    return (
      <div
        ref={doneRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-center gap-5 py-10 text-center outline-none md:py-14"
      >
        <span className="grid h-16 w-16 place-items-center rounded-full bg-primary text-onprimary">
          <Icon name="check" className="h-8 w-8" />
        </span>
        <h3 className="text-balance text-2xl font-semibold tracking-tight rtl:tracking-normal md:text-3xl">
          {done.title}
        </h3>
        <p className="max-w-md text-pretty leading-relaxed text-muted">
          {done.text}
        </p>
        <MagneticButton
          variant="outline"
          shape="pill"
          className="mt-2"
          onClick={reset}
        >
          {ui.success.again}
        </MagneticButton>
      </div>
    );
  }

  const controls = [];

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const id = uid + "-" + field.name;
    const props = {
      field: field,
      id: id,
      value: values[field.name],
      error: errors[field.name],
      optional: ui.optional,
      onChange: setValue,
    };

    if (field.type === "chips") {
      controls.push(
        <ChipsField key={field.name} {...props} name={uid + field.name} />,
      );
    } else if (field.type === "select") {
      controls.push(<SelectField key={field.name} {...props} />);
    } else {
      controls.push(<TextField key={field.name} {...props} />);
    }
  }

  const sending = status === "sending";

  return (
    <div>
      <div className="mb-7 flex flex-col gap-1 md:mb-9">
        <h3 className="text-xl font-semibold tracking-tight rtl:tracking-normal md:text-2xl">
          {form.title}
        </h3>
        <p className="text-sm text-muted">{ui.requiredNote}</p>
      </div>

      <form
        onSubmit={onSubmit}
        noValidate
        aria-label={form.title}
        className="relative grid gap-x-5 gap-y-6 md:grid-cols-2"
      >
        <div
          aria-hidden="true"
          className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
        >
          <input
            ref={trapRef}
            type="text"
            name="company_url"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        {controls}

        {status === "error" ? (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger md:col-span-2"
          >
            <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
            {ui.errors.send}
          </p>
        ) : null}

        <div className="mt-2 flex flex-col-reverse gap-5 md:col-span-2 md:flex-row md:items-center md:justify-between">
          <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted">
            {form.note}
          </p>
          <MagneticButton
            type="submit"
            variant="primary"
            shape="pill"
            disabled={sending}
            aria-busy={sending}
            className="w-full disabled:cursor-not-allowed disabled:opacity-70 md:w-auto md:px-10"
          >
            {sending ? (
              <>
                <Spinner />
                {ui.sending}
              </>
            ) : (
              <>
                {form.submit}
                <Icon
                  name="arrow"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                />
              </>
            )}
          </MagneticButton>
        </div>
      </form>
    </div>
  );
}

export default function ContactSection({
  id = "contact",
  eyebrow,
  title,
  text,
  tabsLabel,
  modes,
  ui,
  delivery,
  headingAs = "h2",
}) {
  const uid = useId();
  const rootRef = useRef(null);
  const panelRefs = useRef({});
  const tabRefs = useRef([]);
  const lastMode = useRef(null);
  const [active, setActive] = useState(modes[0].id);

  useGSAP(
    function () {
      const panel = panelRefs.current[active];
      const changed = lastMode.current !== null && lastMode.current !== active;
      lastMode.current = active;

      if (!panel || !changed) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", function () {
        gsap.fromTo(
          panel,
          { y: 18, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
          },
        );
      });

      return function () {
        mm.revert();
      };
    },
    { scope: rootRef, dependencies: [active], revertOnUpdate: true },
  );

  function onTabKeys(event, index) {
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const step = rtl ? -1 : 1;
    let next = null;

    if (event.key === "ArrowRight") {
      next = index + step;
    } else if (event.key === "ArrowLeft") {
      next = index - step;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = modes.length - 1;
    }

    if (next === null) {
      return;
    }

    event.preventDefault();
    next = (next + modes.length) % modes.length;
    setActive(modes[next].id);
    tabRefs.current[next].focus();
  }

  const tabButtons = [];
  const panels = [];

  for (let i = 0; i < modes.length; i++) {
    const mode = modes[i];
    const selected = mode.id === active;
    const index = i;

    tabButtons.push(
      <button
        key={mode.id}
        ref={function (node) {
          tabRefs.current[index] = node;
        }}
        type="button"
        role="tab"
        id={uid + "-tab-" + mode.id}
        aria-selected={selected}
        aria-controls={uid + "-panel-" + mode.id}
        tabIndex={selected ? 0 : -1}
        onClick={function () {
          setActive(mode.id);
        }}
        onKeyDown={function (event) {
          onTabKeys(event, index);
        }}
        className={
          "flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold outline-none transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-5 " +
          (selected
            ? "bg-primary text-onprimary"
            : "text-muted hover:text-content")
        }
      >
        {mode.icon ? (
          <Icon name={mode.icon} className="hidden h-4 w-4 sm:block" />
        ) : null}
        {mode.label}
      </button>,
    );

    panels.push(
      <div
        key={mode.id}
        ref={function (node) {
          panelRefs.current[mode.id] = node;
        }}
        role="tabpanel"
        id={uid + "-panel-" + mode.id}
        aria-labelledby={uid + "-tab-" + mode.id}
        hidden={!selected}
      >
        <FormPanel mode={mode} ui={ui} delivery={delivery} />
      </div>,
    );
  }

  const assurances = [];

  for (let i = 0; i < ui.assurances.length; i++) {
    assurances.push(
      <li key={i} className="flex items-center gap-2">
        <Icon name="check" className="h-4 w-4 text-primary" />
        {ui.assurances[i]}
      </li>,
    );
  }

  return (
    <section ref={rootRef} id={id} className="scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-site px-6 md:px-10">
        <SectionHeading
          as={headingAs}
          align="center"
          eyebrow={eyebrow}
          title={title}
          text={text}
        >
          <div
            role="tablist"
            aria-label={tabsLabel}
            className="motion-hide mx-auto mt-10 flex w-full max-w-lg gap-1.5 rounded-full border border-line bg-surface p-1.5"
          >
            {tabButtons}
          </div>
        </SectionHeading>

        <Reveal className="mx-auto mt-8 max-w-4xl md:mt-10">
          <div className="motion-hide relative isolate overflow-hidden rounded-4xl border border-line bg-surface p-5 sm:p-8 md:p-12">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -inset-e-24 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
            ></span>
            {panels}
          </div>

          <ul className="motion-hide mt-6 flex flex-wrap justify-center gap-x-7 gap-y-2.5 text-sm text-muted">
            {assurances}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
