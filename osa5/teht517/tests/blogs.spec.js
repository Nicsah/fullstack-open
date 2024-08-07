const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blogs', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    expect(page.getByTestId('loginForm'))
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('salainen')
      await page.getByRole('button', {name: 'login'}).click()
      await expect(page.getByText('Tervetuloa Matti Luukkainen')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await page.getByRole('textbox').first().fill('mluukkai')
        await page.getByRole('textbox').last().fill('wrong')
        await page.getByRole('button', {name: 'login'}).click()
        await expect(page.getByText('Virheellinen käyttäjänimi tai salasana')).toBeVisible()
        await expect(page.getByText('Tervetuloa Matti Luukkainen')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
        await page.getByRole('textbox').first().fill('mluukkai')
        await page.getByRole('textbox').last().fill('salainen')
        await page.getByRole('button', {name: 'login'}).click()
    })
  
    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', {name: 'create new blog'}).click()
      await page.getByTestId('title').fill('TITLE TESTI')
      await page.getByTestId('author').fill('AUTHOR TESTI')
      await page.getByTestId('url').fill('URL TESTI')
      await page.getByRole('button', {name: 'create'}).click()
      await expect(page.getByText('Uusi blogi TITLE TESTI lisätty')).toBeVisible()
      await expect(page.getByText('TITLE TESTI AUTHOR TESTI')).toBeVisible()
    })

    describe('when logged in and blog created', () => {
        beforeEach(async ({ page }) => {
            await page.getByRole('button', {name: 'create new blog'}).click()
            await page.getByTestId('title').fill('TITLE TESTI')
            await page.getByTestId('author').fill('AUTHOR TESTI')
            await page.getByTestId('url').fill('URL TESTI')
            await page.getByRole('button', {name: 'create'}).click()
        })

        test('liking a blog is possible', async ({page}) => {
            await page.getByRole('button', {name: 'view'}).click()
            await page.getByRole('button', {name: 'like'}).click()
            await expect(page.getByText('likes 1')).toBeVisible()
        })

        test('blog can be deleted by creator', async ({page}) => {
            await page.getByRole('button', {name: 'view'}).click()
            page.on('dialog', async (dialog) => {
                expect(dialog.message()).toEqual('Poista blog TITLE TESTI')
                await dialog.accept()
            })
            await page.getByRole('button', {name: 'remove'}).click()
            await expect(page.getByText('TITLE TESTI AUTHOR TESTI')).not.toBeVisible()
            await expect(page.getByText('Blogi TITLE TESTI poistettu')).toBeVisible()
        })
        test('only blog creator can see deletion button', async ({page, request}) => {
            await page.getByRole('button', {name: 'view'}).click()
            await expect(page.getByRole('button', {name: 'remove'})).toBeVisible()

            //logout
            await page.getByRole('button', {name: 'logout'}).click()
            await request.post('http://localhost:3003/api/users', {
                data: {
                  username: 'testeri',
                  password: 'salainen'
                }
            })
            await page.reload()
            await page.getByRole('textbox').first().fill('testeri')
            await page.getByRole('textbox').last().fill('salainen')
            await page.getByRole('button', {name: 'login'}).click()
            await page.getByRole('button', {name: 'view'}).click()
            await expect(page.getByRole('button', {name: 'remove'})).not.toBeVisible()
        })
        test('blogs are ordered by likes', async ({page}) => {
            await page.getByRole('button', {name: 'create new blog'}).click()
            await page.getByTestId('title').fill('hiano blogi')
            await page.getByTestId('author').fill('meikäläinen')
            await page.getByTestId('url').fill('eiole.fi')
            await page.getByRole('button', {name: 'create'}).click()
            await expect(page.getByText('Uusi blogi hiano blogi lisätty')).toBeVisible()

            let blogList = await page.getByTestId('blog').all()
            expect(blogList[0]).toContainText('TITLE TESTI')
            expect(blogList[1]).toContainText('hiano blogi')

            const viewbuttons = await page.getByRole('button', {name: 'view'}).all()
            await viewbuttons[1].click()
            await page.getByRole('button', {name: 'like'}).click()
            await viewbuttons[0].click()

            blogList = await page.getByTestId('blog').all()
            expect(blogList[0]).toContainText('hiano blogi')
            expect(blogList[1]).toContainText('TITLE TESTI')
        })
    })
  })
})