// swift-tools-version:5.0

import PackageDescription

let package = Package(
  name: "Swifter",

  products: [
    .library(name: "Swifter", targets: ["Swifter"])
  ],

  dependencies: [],

  targets: [
    .target(
      name: "Swifter", 
      dependencies: [], 
      path: "XCode/Sources"
      )
  ]
)
