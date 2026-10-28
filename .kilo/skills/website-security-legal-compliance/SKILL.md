---
name: website-security-legal-compliance
description: Secure web applications and ensure legal compliance in Brazil. Use when handling secrets, authentication, data protection, privacy policies, cookies, or LGPD requirements. Covers OWASP vulnerabilities, secret management, privacy by design, LGPD, and Brazilian legal obligations.
---

# Website Security & Legal Compliance

Protect users and the business; comply with Brazilian law (LGPD and related regulations).

## Security Baseline

- Follow OWASP Top 10; treat every input as untrusted.
- Defense in depth: validate, sanitize, encode, and authorize.
- Keep dependencies updated; run `npm audit` / `pip audit` regularly.
- Use HTTPS everywhere; HSTS enabled.
- Set security headers: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.

## Secrets & API Keys

- Never commit secrets; use `.env` (gitignored) and a secret manager in prod.
- Rotate leaked keys immediately; assume compromise.
- Scope keys to least privilege; separate dev/staging/prod keys.
- Never expose server secrets in client bundles; use server-side proxy.
- Detect secrets in CI with gitleaks/trufflehog; block on findings.
- Don't log tokens, passwords, or PII.

## Input Validation & Output Encoding

- Validate on the server (never trust client validation).
- Use allowlists over denylists.
- Parameterized queries / ORM; never concatenate SQL.
- Encode output per context (HTML, attribute, JS, URL, CSS).
- Prevent XSS, CSRF (tokens/SameSite cookies), SSRF, path traversal.
- Set `Content-Security-Policy` to restrict script sources.

## Authentication & Session

- Strong password policy + bcrypt/argon2 hashing.
- MFA for privileged accounts.
- Secure cookies: `HttpOnly`, `Secure`, `SameSite`.
- Session fixation protection; regenerate session on login.
- Rate-limit login and sensitive endpoints.
- Account lockout/backoff with care (avoid DoS on accounts).

## Data Protection (Privacy by Design)

- Collect only necessary data (data minimization).
- Define retention periods; delete when no longer needed.
- Encrypt data at rest and in transit.
- Separate PII from analytics; pseudonymize where possible.
- Access controls and audit logs for sensitive data.

## LGPD (Lei Geral de Proteção de Dados - Lei 13.709/2018)

- Identify roles: controlador, operador, encarregado (DPO).
- Lawful bases (art. 7): consent, contract, legal obligation, legitimate interest, etc.
- Consent must be free, informed, unambiguous, and granular; keep records.
- Honor data subject rights (art. 18): access, correction, deletion, portability, info on sharing, revocation of consent.
- Provide a privacy policy in clear Portuguese, easy to find.
- Register processing activities (ROPA) and assess high-risk processing (RIPD/DPIA).
- Notify ANPD and affected users of security incidents (art. 48).
- Cross-border transfers require adequate safeguards.
- Special protection for sensitive data and children's/adolescents' data.

## Brazilian Legal Requirements (Site)

- LGPD compliance (above).
- Marco Civil da Internet (Lei 12.965/2014): keep access logs for 6 months; user rights; net neutrality.
- Consumer Defense Code (CDC, Lei 8.078/1990): clear pricing, refund rules (7-day regret for distance sales), no abusive clauses.
- E-commerce rules: visible company info (CNPJ, address, contact), terms of use, privacy policy.
- Accessibility (Lei Brasileira de Inclusão, 13.146/2015) and WCAG for public services.
- Cookie consent banner when using non-essential cookies; allow granular choice.
- Terms of Service and Privacy Policy reviewed by legal counsel.
- For financial/health data, additional sector regulations apply.

## Incident Response

- Have a documented IR plan; define roles and contacts.
- Detect, contain, eradicate, recover, post-mortem.
- Notify ANPD within reasonable time when risk to data subjects.
- Communicate transparently to affected users.

## Checklist Before Shipping

- [ ] No secrets in repo or client bundle.
- [ ] Security headers configured and verified.
- [ ] Input validation and output encoding in place.
- [ ] Auth/authz tested for all roles.
- [ ] Privacy policy and terms published in PT-BR.
- [ ] Cookie consent implemented (if applicable).
- [ ] LGPD data subject rights flow documented.
- [ ] Dependency audit clean.
- [ ] Incident response plan documented.
- [ ] Legal review completed for new data processing.
