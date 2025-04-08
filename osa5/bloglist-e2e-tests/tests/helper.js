const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()

  await page.getByText(`${title} ${author}`).waitFor()
}

const likeBlog = async (page) => {
  await page.getByRole('button', { name: 'view' }).click()
  await page.getByRole('button', { name: 'like' }).click()
}

const removeBlog = async (page) => {
  await page.getByRole('button', { name: 'view' }).click()
  await page.getByRole('button', { name: 'remove' }).click()
}

const addLikes = async (page, count) => {
  for (let i = 0; i < count; i++) {
    await page.getByRole('button', { name: 'like' }).click()
  }
  await page.getByRole('button', { name: 'hide' }).click()
}

const populateLikes = async (page) => {
  const blogsViewButton = await page.getByRole('button', { name: 'view' }).all()

  await blogsViewButton[0].click()
  await addLikes(page, 1)

  await blogsViewButton[1].click()
  await addLikes(page, 3)

  await blogsViewButton[2].click()
  await addLikes(page, 2)
}

export { loginWith, createBlog, likeBlog, removeBlog, populateLikes }
