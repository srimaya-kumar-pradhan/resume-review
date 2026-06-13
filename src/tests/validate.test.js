import {
  validateName,
  validateDegree,
  validateYearOfStudy,
  validateTags,
  validateCareerGoals,
  validateResumeText,
  validateProfile,
  containsHTML,
  YEAR_OPTIONS,
} from '../utils/validate';

describe('containsHTML', () => {
  test('returns true for strings with HTML tags', () => {
    expect(containsHTML('<script>alert("xss")</script>')).toBe(true);
    expect(containsHTML('<b>bold</b>')).toBe(true);
    expect(containsHTML('<img src=x>')).toBe(true);
  });

  test('returns false for clean strings', () => {
    expect(containsHTML('Hello world')).toBe(false);
    expect(containsHTML('3 + 5 = 8')).toBe(false);
    expect(containsHTML('')).toBe(false);
  });
});

describe('validateName', () => {
  test('returns null for valid names', () => {
    expect(validateName('John Doe')).toBeNull();
    expect(validateName('AB')).toBeNull(); // min length
    expect(validateName('A'.repeat(100))).toBeNull(); // max length
  });

  test('returns error for missing name', () => {
    expect(validateName('')).toBeTruthy();
    expect(validateName(null)).toBeTruthy();
    expect(validateName(undefined)).toBeTruthy();
  });

  test('returns error for too short name', () => {
    expect(validateName('A')).toMatch(/at least 2/i);
  });

  test('returns error for too long name', () => {
    expect(validateName('A'.repeat(101))).toMatch(/100 characters/i);
  });

  test('returns error for HTML in name', () => {
    expect(validateName('<b>John</b>')).toMatch(/HTML/i);
  });
});

describe('validateDegree', () => {
  test('returns null for valid degree', () => {
    expect(validateDegree('B.Tech Computer Science')).toBeNull();
  });

  test('returns error for missing degree', () => {
    expect(validateDegree('')).toBeTruthy();
    expect(validateDegree(null)).toBeTruthy();
  });

  test('returns error for too short degree', () => {
    expect(validateDegree('X')).toMatch(/at least 2/i);
  });

  test('returns error for too long degree', () => {
    expect(validateDegree('D'.repeat(101))).toMatch(/100 characters/i);
  });

  test('returns error for HTML in degree', () => {
    expect(validateDegree('<script>x</script>')).toMatch(/HTML/i);
  });
});

describe('validateYearOfStudy', () => {
  test('returns null for all valid year options', () => {
    YEAR_OPTIONS.forEach((year) => {
      expect(validateYearOfStudy(year)).toBeNull();
    });
  });

  test('returns error for missing year', () => {
    expect(validateYearOfStudy('')).toBeTruthy();
    expect(validateYearOfStudy(null)).toBeTruthy();
  });

  test('returns error for invalid year value', () => {
    expect(validateYearOfStudy('5th')).toMatch(/must be one of/i);
    expect(validateYearOfStudy('First')).toMatch(/must be one of/i);
  });
});

describe('validateTags (Skills / Interests)', () => {
  test('returns null for valid tags', () => {
    expect(validateTags(['JavaScript', 'Python'], 'Skills')).toBeNull();
    expect(validateTags(['AI'], 'Interests')).toBeNull();
  });

  test('returns error for empty array', () => {
    expect(validateTags([], 'Skills')).toMatch(/at least one/i);
  });

  test('returns error for non-array', () => {
    expect(validateTags('JavaScript', 'Skills')).toMatch(/at least one/i);
    expect(validateTags(null, 'Skills')).toMatch(/at least one/i);
  });

  test('returns error for empty string tags', () => {
    expect(validateTags(['', '  '], 'Skills')).toMatch(/non-empty/i);
  });

  test('returns error for tag over 50 chars', () => {
    expect(validateTags(['A'.repeat(51)], 'Skills')).toMatch(/50 characters/i);
  });

  test('returns error for tags with HTML', () => {
    expect(validateTags(['<b>React</b>'], 'Skills')).toMatch(/HTML/i);
  });
});

describe('validateCareerGoals', () => {
  test('returns null for valid goals', () => {
    const validGoal = 'I want to become a full-stack developer and work at a top tech company.';
    expect(validateCareerGoals(validGoal)).toBeNull();
  });

  test('returns error for missing goals', () => {
    expect(validateCareerGoals('')).toBeTruthy();
    expect(validateCareerGoals(null)).toBeTruthy();
  });

  test('returns error for goals under 20 chars', () => {
    expect(validateCareerGoals('Short goal')).toMatch(/at least 20/i);
  });

  test('returns error for goals over 500 chars', () => {
    expect(validateCareerGoals('G'.repeat(501))).toMatch(/500 characters/i);
  });

  test('returns error for HTML in goals', () => {
    expect(validateCareerGoals('<div>'.padEnd(25, 'x'))).toMatch(/HTML/i);
  });
});

describe('validateResumeText', () => {
  test('returns null for valid resume text', () => {
    expect(validateResumeText('A'.repeat(100))).toBeNull();
    expect(validateResumeText('B'.repeat(5000))).toBeNull();
  });

  test('returns error for missing resume', () => {
    expect(validateResumeText('')).toBeTruthy();
    expect(validateResumeText(null)).toBeTruthy();
  });

  test('returns error for resume under 100 chars', () => {
    expect(validateResumeText('Short resume')).toMatch(/at least 100/i);
  });

  test('returns error for resume over 5000 chars', () => {
    expect(validateResumeText('X'.repeat(5001))).toMatch(/5000 characters/i);
  });
});

describe('validateProfile', () => {
  const validProfile = {
    name: 'Jane Smith',
    degree: 'B.Sc. Computer Science',
    yearOfStudy: '3rd',
    skills: ['JavaScript', 'React'],
    interests: ['Web Development'],
    careerGoals: 'I aim to become a software engineer at a leading tech company within 3 years.',
  };

  test('returns empty object for valid profile', () => {
    const errors = validateProfile(validProfile);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  test('returns all errors for completely empty profile', () => {
    const errors = validateProfile({
      name: '',
      degree: '',
      yearOfStudy: '',
      skills: [],
      interests: [],
      careerGoals: '',
    });
    expect(Object.keys(errors)).toHaveLength(6);
    expect(errors.name).toBeTruthy();
    expect(errors.degree).toBeTruthy();
    expect(errors.yearOfStudy).toBeTruthy();
    expect(errors.skills).toBeTruthy();
    expect(errors.interests).toBeTruthy();
    expect(errors.careerGoals).toBeTruthy();
  });

  test('returns only errors for invalid fields', () => {
    const errors = validateProfile({
      ...validProfile,
      name: '', // invalid
      skills: [], // invalid
    });
    expect(Object.keys(errors)).toHaveLength(2);
    expect(errors.name).toBeTruthy();
    expect(errors.skills).toBeTruthy();
    expect(errors.degree).toBeUndefined();
  });
});
