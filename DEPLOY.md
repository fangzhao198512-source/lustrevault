
==========================================
  🚀 部署步骤（2步，2分钟）
==========================================

第 1️⃣ 步：推送到 GitHub
────────────────────────

1. 打开浏览器，登录 https://github.com
2. 点右上角 + → New repository
3. Repository name 填：lustrevault
4. 选 Public（免费）
5. 不要勾任何初始化选项
6. 点 Create repository

7. 在出现的页面中，复制这三行命令（HTTPS 方式）：
   git remote add origin https://github.com/YOUR_USERNAME/lustrevault.git
   git branch -M main
   git push -u origin main

   ⚠️ 把"你的用户名"改成你的 GitHub 用户名

8. 回到这个终端，粘贴并执行上面那三行命令



第 2️⃣ 步：部署到 Vercel
────────────────────────

1. 打开 https://vercel.com 用 GitHub 登录
2. 点 Add New → Project
3. 选择刚推送的 lustrevault 仓库
4. 点 Deploy（默认配置就行，不需要改任何东西）
5. 部署后，去 Project → Settings → Environment Variables
6. 添加：

   Name: STRIPE_SECRET_KEY
   Value: sk_live_你的Stripe密钥（从 https://dashboard.stripe.com/apikeys 获取）

7. 回到 Deployments，点 Redeploy



🎉 完成！你的网站在 ： https://lustrevault.vercel.app
