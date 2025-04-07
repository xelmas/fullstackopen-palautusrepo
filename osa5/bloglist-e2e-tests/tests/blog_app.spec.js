const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, likeBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Test user',
        username: 'testuser',
        password: 'salainen',
      },
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Log in to application')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Log in to application')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'salainen')
      await expect(page.getByText('Test user logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testing', 'salainen')
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'salainen')
      await createBlog(page, 'testing title', 'testing author', 'testing url')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'new testing title',
        'tester author',
        'testing url'
      )
      await expect(
        page.getByText('a new blog new testing title by tester author added')
      ).toBeVisible()
      await expect(
        page.getByText('new testing title tester author')
      ).toBeVisible()
    })

    test('and blog can be liked', async ({ page }) => {
      await likeBlog(page)
      await expect(page.getByText('likes 1')).toBeVisible()
    })
  })
})
