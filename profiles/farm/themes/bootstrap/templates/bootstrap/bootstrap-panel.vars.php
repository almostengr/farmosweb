<?php
/**
 * @file
 * Stub file for "bootstrap_panel" theme hook [pre]process functions.
 */

/**
 * Pre-processes variables for the "bootstrap_panel" theme hook.
 *
 * See template for list of available variables.
 *
 * @see bootstrap-panel.tpl.php
 *
 * @ingroup theme_preprocess
 */
function bootstrap_preprocess_bootstrap_panel(&$variables) {
  $element = &$variables['element'];

  // Set the element's attributes.
  element_set_attributes($element, array('id'));

  // Retrieve the attributes for the element.
  $attributes = &_bootstrap_get_attributes($element);

  // Add panel and panel-default classes.
  $attributes['class'][] = 'panel';
  $attributes['class'][] = 'panel-default';

  // states.js requires form-wrapper on fieldset to work properly.
  $attributes['class'][] = 'form-wrapper';

  // Handle collapsible panels.
  $variables['collapsible'] = FALSE;
  if (isset($element['#collapsible'])) {
    $variables['collapsible'] = $element['#collapsible'];
  }
  $variables['collapsed'] = FALSE;
  if (isset($element['#collapsed'])) {
    $variables['collapsed'] = $element['#collapsed'];
    // Remove collapsed class since we only want it to apply to the fieldset
    // body element.
    if ($index = array_search('collapsed', $attributes['class'])) {
      unset($attributes['class'][$index]);
      $attributes['class'] = array_values($attributes['class']);
    }
  }

  // Generate an ID for the fieldset wrapper and body elements.
  if (!isset($attributes['id'])) {
    $attributes['id'] = drupal_html_id('bootstrap-panel');
  }
  $variables['body_id'] = drupal_html_id($attributes['id'] . '--body');

  // Set the target to the fieldset body element.
  $variables['target'] = '#' . $variables['body_id'];

  // Build the panel content.
  $variables['content'] = $element['#children'];
  if (isset($element['#value'])) {
    $variables['content'] .= $element['#value'];
  }

  // Iterate over optional variables.
  $keys = array(
    'description',
    'prefix',
    'suffix',
    'title',
  );
  foreach ($keys as $key) {
    $variables[$key] = !empty($element["#$key"]) ? $element["#$key"] : FALSE;
  }

  // Add the attributes.
  $variables['attributes'] = $attributes;
}

/**
 * Processes variables for the "bootstrap_panel" theme hook.
 *
 * See template for list of available variables.
 *
 * @see bootstrap-panel.tpl.php
 *
 * @ingroup theme_process
 */
function bootstrap_process_bootstrap_panel(&$variables) {
  $variables['attributes'] = drupal_attributes($variables['attributes']);
  if (!empty($variables['title'])) {
    $variables['title'] = filter_xss_admin(render($variables['title']));
  }
  if (!empty($variables['description'])) {
    $variables['description'] = filter_xss_admin(render($variables['description']));
  }
}
