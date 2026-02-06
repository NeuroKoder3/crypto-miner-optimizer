#include <QApplication>
#include <QCoreApplication>
#include <QDir>
#include <QFile>
#include <QFileInfo>
#include <QColor>
#include <QPalette>
#include <QStandardPaths>
#include <QUrl>
#include <QWebEnginePage>
#include <QWebEngineProfile>
#include <QWebEngineSettings>
#include <QWebEngineUrlRequestInterceptor>
#include <QWebEngineView>

class OfflineRequestInterceptor final : public QWebEngineUrlRequestInterceptor {
public:
  void interceptRequest(QWebEngineUrlRequestInfo &info) override {
    const QUrl url = info.requestUrl();
    const QString scheme = url.scheme();
    // Allow file:// and qrc:// (local resources)
    if (scheme == QStringLiteral("file") || scheme == QStringLiteral("qrc") ||
        scheme == QStringLiteral("data") || scheme == QStringLiteral("blob")) {
      return; // Allow local resources
    }
    // Block all external network requests
    info.block(true);
  }
};

int main(int argc, char *argv[]) {
  // Fix flickering: use software rendering for stability
  qputenv("QT_QUICK_BACKEND", "software");
  qputenv("QTWEBENGINE_CHROMIUM_FLAGS", 
          "--disable-gpu "
          "--disable-gpu-compositing "
          "--disable-gpu-vsync "
          "--enable-features=UseSkiaRenderer");

  QApplication app(argc, argv);
  app.setApplicationName(QStringLiteral("Crypto Miner Optimizer"));
  app.setOrganizationName(QStringLiteral("CryptoMinerOptimizer"));

  const QString appDir = QCoreApplication::applicationDirPath();
  const QString webRoot = QDir(appDir).filePath(QStringLiteral("web"));
  const QString indexPath = QDir(webRoot).filePath(QStringLiteral("index.html"));
  if (!QFileInfo(indexPath).exists()) {
    // Expected layout: alongside the exe, there is a "web/" folder containing index.html.
    // Example: qt/web/index.html copied from the Vite dist output.
    return 1;
  }

  auto *view = new QWebEngineView();
  auto *page = new QWebEnginePage(view);
  auto *profile = page->profile();

  // Set dark background to prevent white flash (matches app theme #0a0a0f)
  QPalette darkPalette;
  darkPalette.setColor(QPalette::Window, QColor(10, 10, 15));
  darkPalette.setColor(QPalette::Base, QColor(10, 10, 15));
  view->setPalette(darkPalette);
  view->setAutoFillBackground(true);
  page->setBackgroundColor(QColor(10, 10, 15));

  profile->setPersistentStoragePath(
      QStandardPaths::writableLocation(QStandardPaths::AppDataLocation));
  profile->setHttpCacheType(QWebEngineProfile::DiskHttpCache);
  profile->setPersistentCookiesPolicy(QWebEngineProfile::AllowPersistentCookies);
  profile->setUrlRequestInterceptor(new OfflineRequestInterceptor());

  view->setPage(page);
  view->settings()->setAttribute(QWebEngineSettings::LocalContentCanAccessRemoteUrls, false);
  // Allow loading bundled assets (css/js) from file URLs while still blocking any non-localhost network requests.
  view->settings()->setAttribute(QWebEngineSettings::LocalContentCanAccessFileUrls, true);
  view->settings()->setAttribute(QWebEngineSettings::JavascriptEnabled, true);
  view->settings()->setAttribute(QWebEngineSettings::LocalStorageEnabled, true);

  view->resize(1400, 900);
  
  // Show window only after page finishes loading to prevent flashing
  QObject::connect(view, &QWebEngineView::loadFinished, view, [view](bool ok) {
    Q_UNUSED(ok);
    view->show();
    view->raise();
    view->activateWindow();
  });

  const QUrl url = QUrl::fromLocalFile(indexPath);
  view->load(url);

  return app.exec();
}
