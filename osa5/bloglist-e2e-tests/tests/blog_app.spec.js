const { test, expect, beforeEach, describe } = require('@playwright/test')
const {
  loginWith,
  createBlog,
  likeBlog,
  removeBlog,
  populateLikes,
} = require('./helper')

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
    await request.post('/api/users', {
      data: {
        name: 'Other user',
        username: 'otheruser',
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
      await expect(page.getByText('Test user logged in').first()).toBeVisible()
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

    test('remove button for blog is only visible to its adder', async ({
      page,
    }) => {
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
    })

    test('and blog can be removed', async ({ page }) => {
      page.once('dialog', async (dialog) => {
        await dialog.accept()
      })
      await removeBlog(page)
      await expect(
        page.getByText('testing title testing author')
      ).not.toBeVisible()
    })
    test('remove button for blog is not visible to others', async ({
      page,
    }) => {
      await page.getByRole('button', { name: 'log out' }).click()
      await loginWith(page, 'otheruser', 'salainen')

      await page.getByRole('button', { name: 'view' }).click()
      await expect(
        page.getByRole('button', { name: 'remove' })
      ).not.toBeVisible()
    })

    describe('blogs are sorted in descending order by likes', () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          'testing title with the most likes',
          'testing author',
          'testing url'
        )
        await createBlog(
          page,
          'testing title with the 2nd most likes',
          'testing author',
          'testing url'
        )
        await createBlog(
          page,
          'testing title with least likes',
          'testing author',
          'testing url'
        )
        await populateLikes(page)
      })

      test('blogs are sorted correctly', async ({ page }) => {
        const blogs = await page
          .locator('[data-testid^="blog-title-author"]')
          .all()
        const blogDetails = await Promise.all(blogs.map((el) => el.innerText()))

        expect(blogDetails).toEqual([
          'testing title with the most likes testing author',
          'testing title with the 2nd most likes testing author',
          'testing title testing author',
          'testing title with least likes testing author',
        ])
      })
    })
  })
})
