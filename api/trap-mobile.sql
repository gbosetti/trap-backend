-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 27, 2020 at 09:51 PM
-- Server version: 5.7.30-0ubuntu0.18.04.1
-- PHP Version: 7.2.24-0ubuntu0.18.04.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `trap-mobile`
--

-- --------------------------------------------------------

--
-- Table structure for table `movimientos`
--

CREATE TABLE `movimientos` (
  `id` int(11) NOT NULL,
  `entrada` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `salida` timestamp NULL DEFAULT NULL,
  `dni_usuario` varchar(15) NOT NULL,
  `temperatura` decimal(3,1) NOT NULL,
  `supero_olfativo` tinyint(4) NOT NULL,
  `dni_guardia_ingreso` varchar(15) NOT NULL,
  `dni_guardia_egreso` varchar(15) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `movimientos_respuestas`
--

CREATE TABLE `movimientos_respuestas` (
  `id_movimiento` int(11) NOT NULL,
  `id_pregunta` int(11) NOT NULL,
  `superada` tinyint(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `movimientos_unidades_academicas`
--

CREATE TABLE `movimientos_unidades_academicas` (
  `id_movimiento` int(11) NOT NULL,
  `id_unidad_academica` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `preguntas`
--

CREATE TABLE `preguntas` (
  `id` int(11) NOT NULL,
  `cuerpo` varchar(100) NOT NULL,
  `respuesta_esperada` tinyint(4) NOT NULL DEFAULT '1'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `unidades_academicas`
--

CREATE TABLE `unidades_academicas` (
  `nombre` varchar(50) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `dni` varchar(15) NOT NULL,
  `apellido` varchar(35) NOT NULL,
  `nombre` varchar(35) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `usuarios_admins`
--

CREATE TABLE `usuarios_admins` (
  `dni_usuario` varchar(15) NOT NULL,
  `habilitado` tinyint(4) NOT NULL DEFAULT '0',
  `password` varchar(15) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `usuarios_guardias`
--

CREATE TABLE `usuarios_guardias` (
  `dni_usuario` varchar(15) NOT NULL,
  `password` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `movimientos`
--
ALTER TABLE `movimientos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `movimientos_respuestas`
--
ALTER TABLE `movimientos_respuestas`
  ADD PRIMARY KEY (`id_movimiento`,`id_pregunta`);

--
-- Indexes for table `movimientos_unidades_academicas`
--
ALTER TABLE `movimientos_unidades_academicas`
  ADD PRIMARY KEY (`id_movimiento`,`id_unidad_academica`);

--
-- Indexes for table `preguntas`
--
ALTER TABLE `preguntas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `unidades_academicas`
--
ALTER TABLE `unidades_academicas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`dni`);

--
-- Indexes for table `usuarios_admins`
--
ALTER TABLE `usuarios_admins`
  ADD PRIMARY KEY (`dni_usuario`);

--
-- Indexes for table `usuarios_guardias`
--
ALTER TABLE `usuarios_guardias`
  ADD PRIMARY KEY (`dni_usuario`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `unidades_academicas`
--
ALTER TABLE `unidades_academicas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
