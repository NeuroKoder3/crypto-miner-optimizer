# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Crypto Miner Optimizer seriously. If you discover a security vulnerability, please follow these steps:

### How to Report

1. **Do NOT** create a public GitHub issue for security vulnerabilities
2. Email your findings to the repository maintainer directly
3. Include as much detail as possible:
   - Type of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your report within 48 hours
- **Updates**: We will provide updates on the status of your report within 7 days
- **Resolution**: We aim to resolve critical vulnerabilities within 30 days

### Scope

The following are considered in-scope for security reports:

- Authentication/authorization bypasses
- Cross-site scripting (XSS)
- Code injection vulnerabilities
- Sensitive data exposure
- Insecure data storage
- Dependency vulnerabilities with exploitable impact

### Out of Scope

- Vulnerabilities in third-party dependencies without demonstrated impact
- Social engineering attacks
- Physical security issues
- Denial of service attacks

## Security Best Practices for Users

### Running the Application

1. **Offline Mode**: The application is designed to run fully offline. No sensitive data is transmitted externally
2. **Local Storage**: All data is stored locally on your machine
3. **No API Keys**: The application does not require or store API keys for external services

### Data Protection

- GPU settings and mining profiles are stored locally
- No wallet addresses or private keys are stored by the application
- Profitability calculations use publicly available market data

### Network Security

- The Qt desktop application blocks all external network requests by default
- Web version can be run entirely offline after initial load
- No telemetry or analytics data is collected

## Security Features

- **Encrypted Badge**: Application operates with local data encryption
- **Offline Operation**: Full functionality without internet connection
- **Request Blocking**: Qt wrapper blocks all external network requests
- **No External Dependencies**: Core functionality works without external API calls

## Dependency Security

We actively monitor and update dependencies to address known vulnerabilities:

```bash
# Check for vulnerabilities
npm audit

# Fix non-breaking vulnerabilities
npm audit fix
```

## Acknowledgments

We appreciate security researchers who help keep Crypto Miner Optimizer secure. Contributors who report valid security issues will be acknowledged here (with permission).

---

*Last updated: February 2026*
