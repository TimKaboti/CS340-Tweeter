$functions = @(
  "get_followers_handler",
  "get_user_handler",
  "get_followee_count_handler",
  "get_followees_handler",
  "send_email",
  "get_follower_count_handler",
  "login_handler",
  "is_follower_handler",
  "logout_handler",
  "get_story_handler",
  "follow_user_handler",
  "post_status_handler",
  "register_handler",
  "unfollow_user_handler",
  "get_feed_handler"
)

foreach ($func in $functions) {
  Write-Host "Deploying $func..."
  aws lambda update-function-code `
    --region us-east-1 `
    --function-name $func `
    --zip-file fileb://deploy.zip
}