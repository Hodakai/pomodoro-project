CREATE TABLE IF NOT EXISTS `fart_history`
(
    `id`           INT       NOT NULL AUTO_INCREMENT,
    `work_time`    DOUBLE    NOT NULL,
    `break_time`   DOUBLE    NOT NULL,
    `streak`       INT       NOT NULL,
    `date_created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;