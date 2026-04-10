import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback } from 'react'
import { check } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'
import { Button } from '@salad/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@salad/ui/components/card'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { version } from '@/../package.json'

export const Route = createFileRoute('/configs/app-info')({
  component: RouteComponent,
})

const APP_VERSION = '0.2.1'

function RouteComponent () {
  const { t } = useTranslation(['common'])
  const [checking, setChecking] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [latestVersion, setLatestVersion] = useState<string>('')
  const [updateBody, setUpdateBody] = useState<string>('')
  const [progress, setProgress] = useState<number>(0)

  const checkUpdate = useCallback(async () => {
    setChecking(true)
    try {
      const update = await check()
      if (update) {
        setUpdateAvailable(true)
        setLatestVersion(update.version)
        setUpdateBody(update.body || '')
        toast.info(t('app.update_available'), {
          description: `${APP_VERSION} → ${update.version}`,
        })
      } else {
        setUpdateAvailable(false)
        toast.success(t('app.up_to_date'))
      }
    } catch (error: any) {
      toast.error(t('app.check_failed'), {
        description: error.message,
      })
    } finally {
      setChecking(false)
    }
  }, [t])

  const doUpdate = useCallback(async () => {
    setUpdating(true)
    try {
      const update = await check()
      if (update) {
        let downloaded = 0
        let contentLength = 0

        await update.downloadAndInstall((event) => {
          if (event.event === 'Started') {
            contentLength = event.data.contentLength!
            setProgress(0)
          } else if (event.event === 'Progress') {
            downloaded += event.data.chunkLength
            if (contentLength > 0) {
              setProgress(Math.round((downloaded / contentLength) * 100))
            }
          } else if (event.event === 'Finished') {
            setProgress(100)
          }
        })

        toast.success(t('app.update_installed'))
        await relaunch()
      }
    } catch (error: any) {
      toast.error(t('app.update_failed'), {
        description: error.message,
      })
    } finally {
      setUpdating(false)
    }
  }, [t])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('app.info')}</CardTitle>
          <CardDescription>{t('app.description')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground">{t('app.name')}</span>
            <span className="font-medium">fruit-saladict</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground">{t('app.current_version')}</span>
            <span className="font-mono text-sm">{APP_VERSION}</span>
          </div>
          <div className="p-4 ">
            <div className="text-xs text-gray-500 text-center">
              <p>当前版本: v{version}</p>
              <p className="mt-1">© 2026 Fruit Saladict</p>
            </div>
          </div>
          {updateAvailable && (
            <div className="bg-primary/5 border border-primary/20 rounded-md p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">{t('app.new_version')}</span>
                <span className="font-mono text-sm">{latestVersion}</span>
              </div>
              {updateBody && (
                <p className="text-xs text-muted-foreground whitespace-pre-wrap">{updateBody}</p>
              )}
            </div>
          )}

          {updating && progress > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t('app.downloading')}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              onClick={checkUpdate}
              disabled={checking || updating}
              variant="outline"
              className="flex-1"
            >
              {checking ? t('app.checking') : t('app.check_update')}
            </Button>
            {updateAvailable && (
              <Button
                onClick={doUpdate}
                disabled={updating}
                className="flex-1"
              >
                {updating ? t('app.updating') : t('app.update_now')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
