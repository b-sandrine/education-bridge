# Contributing to EduBridge

Thank you for your interest in contributing to EduBridge! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on education and impact
- Report issues privately to maintainers
- No harassment or discrimination

## Getting Started

### 1. Fork and Clone

```bash
git clone https://github.com/your-username/education-bridge.git
cd education-bridge
git remote add upstream https://github.com/original-repo/education-bridge.git
```

### 2. Set Up Development Environment

```bash
# Install all dependencies
npm install

# In each subsystem
cd backend && npm install
cd ../web && npm install
cd ../mobile && npm install
```

### 3. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

## Development Guidelines

### Code Style

- Follow ESLint configuration
- Use Prettier for formatting
- Write clear, descriptive variable names
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages

```
[type]: Brief description (50 chars max)

Detailed explanation if needed
- Bullet point 1
- Bullet point 2

Closes #123
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (no logic change)
- `refactor:` - Code restructuring
- `test:` - Test additions/changes
- `chore:` - Build, deps, config

### Testing

```bash
# Run tests before committing
cd backend && npm test
cd ../web && npm test
cd ../mobile && npm test

# Check coverage
npm test -- --coverage
```

### Linting

```bash
# Check for issues
npm run lint

# Fix automatically
npm run lint:fix
```

### TypeScript

```bash
# Check types
npm run type-check
```

## Pull Request Process

### 1. Update Your Branch

```bash
git fetch upstream
git rebase upstream/main
```

### 2. Create Pull Request

- Clear title and description
- Reference related issues
- Add screenshots for UI changes
- List breaking changes (if any)

### 3. PR Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested this:
- [ ] Added unit tests
- [ ] Added integration tests
- [ ] Manual testing

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added and passing
- [ ] Verified on browser/device

## Related Issues
Closes #123
```

## Project Structure Contributions

### Backend Changes

```
backend/src/
├── controllers/   ← API request handlers
├── services/      ← Business logic
├── models/        ← Database queries
├── middleware/    ← Express middleware
├── routes/        ← API routes
├── validators/    ← Input validation
└── utils/         ← Helper functions
```

**Adding a new API endpoint:**

1. Create controller in `controllers/newFeature.js`
2. Create service in `services/newFeature.js`
3. Create model in `models/newFeature.js`
4. Add validator in `validators/newFeature.js`
5. Add route in `routes/newFeature.js`
6. Update `routes/index.js` to include new route
7. Add tests in `tests/`
8. Update API documentation

### Frontend Changes

```
web/src/
├── components/    ← Reusable components
├── pages/         ← Page components
├── services/      ← API calls
├── store/         ← Redux state
├── hooks/         ← Custom hooks
└── utils/         ← Utility functions
```

**Adding a new feature:**

1. Create components in `components/`
2. Create page component in `pages/`
3. Create API service in `services/`
4. Add Redux slice in `store/slices/`
5. Add routing in `App.jsx`
6. Style with Tailwind CSS
7. Add tests

### Mobile Changes

```
mobile/src/
├── screens/       ← Screen components
├── components/    ← Reusable components
├── navigation/    ← Navigation setup
├── services/      ← API calls
└── store/         ← Redux state
```

## Documentation Contributions

### Updating Docs

1. Edit relevant .md file in `/docs/`
2. Keep formatting consistent
3. Add examples where helpful
4. Update table of contents if adding sections

### Writing Good Documentation

- Use clear, concise language
- Include code examples
- Add screenshots for visual features
- Explain the "why" not just "what"
- Keep up-to-date with code

## Bug Reports

### Report Template

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. ...
2. ...
3. ...

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots/Logs
Include relevant evidence

## Environment
- OS: [e.g., macOS]
- Browser/App: [e.g., Chrome 90]
- Node version: 16.x
```

## Feature Requests

### Request Template

```markdown
## Problem Statement
What problem does this solve?

## Proposed Solution
How would you solve it?

## Alternative Approaches
Other options considered

## Additional Context
Any other information
```

## Review Process

### What Reviewers Look For

- ✅ Code quality and style
- ✅ Tests and coverage
- ✅ Documentation
- ✅ Performance impact
- ✅ Security implications
- ✅ Breaking changes
- ✅ UI/UX consistency

### Making Requested Changes

```bash
# Make changes
git add .
git commit --fixup abc123  # Referencing the commit to fix
git push

# When ready, squash commits
git rebase -i upstream/main
# Mark fixup commits as 'f' in editor
```

## Setting Up Pre-commit Hooks

```bash
# Install husky
npm install husky --save-dev
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm test"
```

## When Your PR is Merged

```bash
# Update local main
git checkout main
git pull upstream main

# Delete feature branch
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

## Getting Help

- **Chat**: [Discord/Slack community]
- **Email**: dev-team@edubridge.rw
- **Issues**: Use GitHub Issues for bugs
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: See `/docs/` folder

## Recognition

Contributors will be recognized in:
- `CONTRIBUTORS.md`
- Release notes
- Project website

## Development Resources

### Useful Links

- [Backend README](../backend/README.md)
- [Web Frontend README](../web/README.md)
- [Mobile App README](../mobile/README.md)
- [Architecture Docs](./ARCHITECTURE.md)
- [API Docs](./API.md)

### Tools

- Node.js 16+
- Git
- Docker (optional)
- VS Code (recommended)

### VS Code Extensions

- ESLint
- Prettier
- Thunder Client (API testing)
- REST Client
- Git Lens

## Areas for Contribution

### High Priority

- [ ] Core API endpoints
- [ ] Security improvements
- [ ] Performance optimization
- [ ] Bug fixes
- [ ] Test coverage

### Medium Priority

- [ ] UI/UX improvements
- [ ] Documentation
- [ ] Internationalization (i18n)
- [ ] Mobile app features
- [ ] USSD integration

### Nice to Have

- [ ] Analytics dashboard
- [ ] Advanced reporting
- [ ] Content management UI
- [ ] Admin panel enhancements
- [ ] Mobile app polish

## Coding Challenges

### Beginner-Friendly

- Documentation improvements
- Bug fixes (easy label)
- Unit tests for existing code
- UI refinements

### Intermediate

- New features (medium complexity)
- Performance optimization
- Refactoring tasks
- Mobile features

### Advanced

- Architecture decisions
- Complex features
- Security improvements
- DevOps/Infrastructure

## Code Review Etiquette

### As a Reviewer

- Be constructive and encouraging
- Ask questions rather than demand changes
- Acknowledge good work
- Suggest improvements, not demands
- Consider author's perspective

### As an Author

- Respond to feedback respectfully
- Ask for clarification if needed
- Don't take criticism personally
- Be patient with review process
- Thank reviewers

## Licensing

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Don't hesitate to ask! Open an issue or contact the team.

---

**Thank you for contributing to EduBridge!**

Together, we're empowering women and vulnerable children through education.

---

**Last Updated**: 2026-01-25
