const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const headerPath = path.join(rootDir, 'node_modules/react-native-reanimated/Common/cpp/reanimated/CSS/interpolation/transforms/TransformOperationInterpolator.h');
const cppPath = path.join(rootDir, 'node_modules/react-native-reanimated/Common/cpp/reanimated/CSS/interpolation/transforms/TransformOperationInterpolator.cpp');

if (fs.existsSync(headerPath)) {
  let headerContent = fs.readFileSync(headerPath, 'utf8');

  // Add missing headers
  if (!headerContent.includes('#include <utility>')) {
    headerContent = headerContent.replace('#include <memory>', '#include <memory>\n#include <utility>\n#include <stdexcept>\n#include <string>');
  }

  // Inline the specialization
  const targetHeaderStr = `// Specialization for resolvable operations
template <ResolvableOp TOperation>
class TransformOperationInterpolator<TOperation> : public StyleOperationInterpolator {
 public:
  TransformOperationInterpolator(
      const std::shared_ptr<TOperation> &defaultOperation,
      ResolvableValueInterpolatorConfig config);

  std::unique_ptr<StyleOperation> interpolate(
      double progress,
      const std::shared_ptr<StyleOperation> &from,
      const std::shared_ptr<StyleOperation> &to,
      const StyleOperationsInterpolationContext &context) const override;

  std::shared_ptr<StyleOperation> resolveOperation(
      const std::shared_ptr<StyleOperation> &operation,
      const StyleOperationsInterpolationContext &context) const override;

 protected:
  const ResolvableValueInterpolatorConfig config_;

  ResolvableValueInterpolationContext getResolvableValueContext(
      const StyleOperationsInterpolationContext &context) const;
};`;

  const replacementHeaderStr = `// Specialization for resolvable operations
template <ResolvableOp TOperation>
class TransformOperationInterpolator<TOperation> : public StyleOperationInterpolator {
 public:
  TransformOperationInterpolator(
      const std::shared_ptr<TOperation> &defaultOperation,
      ResolvableValueInterpolatorConfig config)
      : StyleOperationInterpolator(defaultOperation), config_(std::move(config)) {}

  std::unique_ptr<StyleOperation> interpolate(
      double progress,
      const std::shared_ptr<StyleOperation> &from,
      const std::shared_ptr<StyleOperation> &to,
      const StyleOperationsInterpolationContext &context) const override {
    const auto &fromOp = *std::static_pointer_cast<TOperation>(from);
    const auto &toOp = *std::static_pointer_cast<TOperation>(to);

    return std::make_unique<TOperation>(
        fromOp.value.interpolate(progress, toOp.value, getResolvableValueContext(context)));
  }

  std::shared_ptr<StyleOperation> resolveOperation(
      const std::shared_ptr<StyleOperation> &operation,
      const StyleOperationsInterpolationContext &context) const override {
    const auto &resolvableOp = std::static_pointer_cast<TOperation>(operation);
    const auto &resolved = resolvableOp->value.resolve(getResolvableValueContext(context));

    if (!resolved.has_value()) {
      throw std::invalid_argument(
          "[Reanimated] Cannot resolve resolvable operation: " + operation->getOperationName() +
          " for node with tag: " + std::to_string(context.node->getTag()));
    }

    return std::make_shared<TOperation>(resolved.value());
  }

 protected:
  const ResolvableValueInterpolatorConfig config_;

  ResolvableValueInterpolationContext getResolvableValueContext(
      const StyleOperationsInterpolationContext &context) const {
    return ResolvableValueInterpolationContext{
        .node = context.node,
        .fallbackInterpolateThreshold = context.fallbackInterpolateThreshold,
        .viewStylesRepository = context.viewStylesRepository,
        .relativeProperty = config_.relativeProperty,
        .relativeTo = config_.relativeTo};
  }
};`;

  if (headerContent.includes(targetHeaderStr)) {
    headerContent = headerContent.replace(targetHeaderStr, replacementHeaderStr);
    fs.writeFileSync(headerPath, headerContent, 'utf8');
    console.log('Successfully patched TransformOperationInterpolator.h');
  } else {
    console.log('TransformOperationInterpolator.h target not found (might already be patched).');
  }
}

if (fs.existsSync(cppPath)) {
  let cppContent = fs.readFileSync(cppPath, 'utf8');

  const targetCppStr = `// Specialization for resolvable operations
template <ResolvableOp TOperation>
TransformOperationInterpolator<TOperation>::TransformOperationInterpolator(
    const std::shared_ptr<TOperation> &defaultOperation,
    ResolvableValueInterpolatorConfig config)
    : StyleOperationInterpolator(defaultOperation), config_(std::move(config)) {}

template <ResolvableOp TOperation>
std::unique_ptr<StyleOperation> TransformOperationInterpolator<TOperation>::interpolate(
    double progress,
    const std::shared_ptr<StyleOperation> &from,
    const std::shared_ptr<StyleOperation> &to,
    const StyleOperationsInterpolationContext &context) const {
  const auto &fromOp = *std::static_pointer_cast<TOperation>(from);
  const auto &toOp = *std::static_pointer_cast<TOperation>(to);

  return std::make_unique<TOperation>(
      fromOp.value.interpolate(progress, toOp.value, getResolvableValueContext(context)));
}

template <ResolvableOp TOperation>
std::shared_ptr<StyleOperation> TransformOperationInterpolator<TOperation>::resolveOperation(
    const std::shared_ptr<StyleOperation> &operation,
    const StyleOperationsInterpolationContext &context) const {
  const auto &resolvableOp = std::static_pointer_cast<TOperation>(operation);
  const auto &resolved = resolvableOp->value.resolve(getResolvableValueContext(context));

  if (!resolved.has_value()) {
    throw std::invalid_argument(
        "[Reanimated] Cannot resolve resolvable operation: " + operation->getOperationName() +
        " for node with tag: " + std::to_string(context.node->getTag()));
  }

  return std::make_shared<TOperation>(resolved.value());
}

template <ResolvableOp TOperation>
ResolvableValueInterpolationContext TransformOperationInterpolator<TOperation>::getResolvableValueContext(
    const StyleOperationsInterpolationContext &context) const {
  return ResolvableValueInterpolationContext{
      .node = context.node,
      .fallbackInterpolateThreshold = context.fallbackInterpolateThreshold,
      .viewStylesRepository = context.viewStylesRepository,
      .relativeProperty = config_.relativeProperty,
      .relativeTo = config_.relativeTo};
}`;

  if (cppContent.includes(targetCppStr)) {
    cppContent = cppContent.replace(targetCppStr, '');
    fs.writeFileSync(cppPath, cppContent, 'utf8');
    console.log('Successfully patched TransformOperationInterpolator.cpp');
  } else {
    console.log('TransformOperationInterpolator.cpp target not found (might already be patched).');
  }
}
